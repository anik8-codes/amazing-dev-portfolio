import * as THREE from 'three/webgpu';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { damp, turn } from './layout';
import type { Input } from './input';
import type { Physics } from './physics';
import type { View } from './view';

const WALK = 5.5;
const RUN = 10;
const JUMP = 10.5;
const GRAVITY = -30;

/**
 * anik8 on foot: a Rapier kinematic character controller (capsule) that slides along walls,
 * steps up kerbs, snaps to the ground and shoves dynamic bodies out of the way. The model
 * turns smoothly toward where it's going and blends idle / walk / jump animations.
 */
export function createPlayer(gltf: GLTF, scale: number, physics: Physics, spawn: THREE.Vector3) {
  const { RAPIER, world } = physics;
  const model = gltf.scene;
  model.scale.setScalar(scale);
  const root = new THREE.Group();
  root.add(model);
  root.position.copy(spawn);

  const height = 0.8 * scale;
  const radius = 0.3 * scale;
  const half = Math.max(0.05, height / 2 - radius);
  const body = world.createRigidBody(
    RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
      spawn.x,
      spawn.y + height / 2,
      spawn.z,
    ),
  );
  const collider = world.createCollider(RAPIER.ColliderDesc.capsule(half, radius), body);
  const kcc = world.createCharacterController(0.05);
  kcc.enableAutostep(0.5, 0.3, false);
  kcc.enableSnapToGround(0.4);
  kcc.setMaxSlopeClimbAngle((50 * Math.PI) / 180);
  kcc.setApplyImpulsesToDynamicBodies(true);
  kcc.setCharacterMass(60);

  // animations: idle / walk / jump, cross-faded
  const mixer = new THREE.AnimationMixer(model);
  const clip = (name: string) => gltf.animations.find((a) => a.name === name);
  const actions = Object.fromEntries(
    (['idle', 'walk', 'jump'] as const).flatMap((n) => {
      const c = clip(n);
      return c ? [[n, mixer.clipAction(c)]] : [];
    }),
  ) as Partial<Record<'idle' | 'walk' | 'jump', THREE.AnimationAction>>;
  let current: THREE.AnimationAction | undefined = actions.idle;
  current?.play();
  const play = (next: THREE.AnimationAction | undefined) => {
    if (!next || next === current) return;
    next.reset().fadeIn(0.18).play();
    current?.fadeOut(0.18);
    current = next;
  };

  const velocity = new THREE.Vector3();
  let vy = 0;
  let grounded = true;
  let facing = 0;
  const move = new THREE.Vector3();

  return {
    root,
    get position() {
      return root.position;
    },
    get speed() {
      return Math.hypot(velocity.x, velocity.z);
    },
    /** Put the player somewhere (chapter list), standing still. */
    teleport(x: number, z: number) {
      body.setTranslation({ x, y: height / 2 + 0.5, z }, true);
      body.setNextKinematicTranslation({ x, y: height / 2 + 0.5, z });
      root.position.set(x, 0.5, z);
      velocity.set(0, 0, 0);
      vy = 0;
    },
    update(dt: number, input: Input, view: View) {
      const m = input.move();
      const moving = Math.hypot(m.x, m.y) > 0.05;
      if (moving) view.track();
      const max = input.running ? RUN : WALK;
      const want = new THREE.Vector3()
        .addScaledVector(view.right, m.x * max)
        .addScaledVector(view.forward, m.y * max);
      const k = grounded ? 10 : 3; // less control in the air
      velocity.x = damp(velocity.x, want.x, k, dt);
      velocity.z = damp(velocity.z, want.z, k, dt);

      if (input.takeJump() && grounded) {
        vy = JUMP;
        grounded = false;
        play(actions.jump);
      }
      vy = grounded && vy < 0 ? -1 : vy + GRAVITY * dt;

      move.set(velocity.x * dt, vy * dt, velocity.z * dt);
      kcc.computeColliderMovement(collider, move);
      const done = kcc.computedMovement();
      grounded = kcc.computedGrounded();
      const t = body.translation();
      const next = { x: t.x + done.x, y: t.y + done.y, z: t.z + done.z };
      if (next.y < -10) Object.assign(next, { x: spawn.x, y: spawn.y + 2, z: spawn.z });
      body.setNextKinematicTranslation(next);
      root.position.set(next.x, next.y - height / 2, next.z);

      if (this.speed > 0.4)
        facing += turn(facing, Math.atan2(velocity.x, velocity.z)) * Math.min(1, dt * 12);
      model.rotation.y = facing;

      if (grounded) {
        if (this.speed > 0.6) {
          play(actions.walk);
          if (actions.walk) actions.walk.timeScale = Math.max(0.8, this.speed / 4.2);
        } else play(actions.idle);
      }
      mixer.update(dt);
    },
  };
}
