'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { Color, InstancedMesh, Object3D, type CatmullRomCurve3 } from 'three';

/** The road through time: a band of paving stones along the curve, with slight colour variation. */
export function Road({
  curve,
  color,
  edge,
}: {
  curve: CatmullRomCurve3;
  color: string;
  edge: string;
}) {
  const stones = useMemo(() => {
    const n = Math.floor(curve.getLength() / 0.62);
    return Array.from({ length: n }, (_, i) => {
      const t = i / n;
      const p = curve.getPointAt(t);
      const d = curve.getTangentAt(t);
      return { x: p.x, z: p.z, angle: Math.atan2(d.x, d.z), alt: i % 3 === 0 };
    });
  }, [curve]);

  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const o = new Object3D();
    const c = new Color();
    stones.forEach((s, i) => {
      o.position.set(s.x, 0.03, s.z);
      o.rotation.set(0, s.angle, 0);
      o.updateMatrix();
      ref.current?.setMatrixAt(i, o.matrix);
      ref.current?.setColorAt(i, c.set(s.alt ? edge : color));
    });
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true;
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    }
  }, [stones, color, edge]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, stones.length]} receiveShadow>
      <boxGeometry args={[2.4, 0.1, 0.56]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}
