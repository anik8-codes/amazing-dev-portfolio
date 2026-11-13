import RAPIER from '@dimforge/rapier3d-compat';
import type * as THREE from 'three/webgpu';
import { shoreRadius } from './layout';

/**
 * Rapier physics: a flat island floor, an invisible fence along the beach, static colliders for
 * buildings and trees, and dynamic bodies (bricks) that the player can knock over.
 */
export async function createPhysics(islandRadius: number) {
  await RAPIER.init();
  const world = new RAPIER.World({ x: 0, y: -24, z: 0 });
  world.createCollider(RAPIER.ColliderDesc.cuboid(300, 1, 300).setTranslation(0, -1, 0));

  // fence: short wall segments just before the water line, all the way round
  const segments = 96;
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const r = shoreRadius(a, islandRadius) - 6;
    const len = ((2 * Math.PI * r) / segments) * 0.62;
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.5, 3, len)
        .setTranslation(Math.cos(a) * r, 3, Math.sin(a) * r)
        .setRotation(yaw(-a)),
    );
  }

  const dynamic: { body: RAPIER.RigidBody; mesh: THREE.Object3D }[] = [];
  const brickBodies = new Map<number, RAPIER.RigidBody>();
  const impacts = new RAPIER.EventQueue(true);

  return {
    RAPIER,
    world,
    /** A fixed box collider matching a world-space bounding box. */
    addBox(box: THREE.Box3) {
      const hx = (box.max.x - box.min.x) / 2;
      const hy = (box.max.y - box.min.y) / 2;
      const hz = (box.max.z - box.min.z) / 2;
      world.createCollider(
        RAPIER.ColliderDesc.cuboid(hx, hy, hz).setTranslation(
          box.min.x + hx,
          box.min.y + hy,
          box.min.z + hz,
        ),
      );
    },
    /** A fixed upright cylinder (tree trunks). */
    addPost(x: number, z: number, radius: number, height: number) {
      world.createCollider(
        RAPIER.ColliderDesc.cylinder(height / 2, radius).setTranslation(x, height / 2, z),
      );
    },
    /** A dynamic box that follows `mesh` (position is the box centre). */
    addDynamicBox(mesh: THREE.Object3D, half: [number, number, number]) {
      const p = mesh.position;
      const body = world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic().setTranslation(p.x, p.y, p.z).setCanSleep(true),
      );
      const collider = world.createCollider(
        RAPIER.ColliderDesc.cuboid(...half)
          .setDensity(0.6)
          .setFriction(0.8)
          .setActiveEvents(RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS)
          .setContactForceEventThreshold(125),
        body,
      );
      brickBodies.set(collider.handle, body);
      dynamic.push({ body, mesh });
    },
    step(dt: number) {
      world.timestep = Math.min(dt, 1 / 30);
      world.step(impacts);
      let loudest: { at: RAPIER.Vector; force: number } | undefined;
      impacts.drainContactForceEvents((impact) => {
        const force = impact.maxForceMagnitude();
        if (force <= 125 || force <= (loudest?.force ?? 0)) return;
        const brick = brickBodies.get(impact.collider1()) ?? brickBodies.get(impact.collider2());
        if (brick) loudest = { at: brick.translation(), force };
      });
      for (const { body, mesh } of dynamic) {
        const t = body.translation();
        const r = body.rotation();
        mesh.position.set(t.x, t.y, t.z);
        mesh.quaternion.set(r.x, r.y, r.z, r.w);
      }
      return loudest;
    },
    dispose() {
      impacts.free();
      world.free();
    },
  };
}

export type Physics = Awaited<ReturnType<typeof createPhysics>>;

function yaw(a: number) {
  return { x: 0, y: Math.sin(a / 2), z: 0, w: Math.cos(a / 2) };
}
