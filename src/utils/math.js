export const EPS = 1e-6
export const TAU = Math.PI * 2
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
export const lerp = (a, b, t) => a + (b - a) * t
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt))

export function vec3(x=0,y=0,z=0){ return {x,y,z} }
export function add(a,b){ return {x:a.x+b.x,y:a.y+b.y,z:a.z+b.z} }
export function sub(a,b){ return {x:a.x-b.x,y:a.y-b.y,z:a.z-b.z} }
export function mul(a,s){ return {x:a.x*s,y:a.y*s,z:a.z*s} }
export function dot(a,b){ return a.x*b.x + a.y*b.y + a.z*b.z }
export function cross(a,b){ return {x:a.y*b.z-a.z*b.y, y:a.z*b.x-a.x*b.z, z:a.x*b.y-a.y*b.x} }
export function length(v){ return Math.hypot(v.x, v.y, v.z) }
export function norm(v){ const L=length(v); return L>EPS? mul(v,1/L): vec3() }
export function project(a, n){ const u = dot(a,n); return mul(n,u) }
export function reflect(v,n){ return sub(v, mul(n, 2*dot(v,n))) }
export function rotateY(v, ang){ const c=Math.cos(ang), s=Math.sin(ang); return {x:c*v.x + s*v.z, y:v.y, z:-s*v.x + c*v.z} }
export function sign(v){ return v<0?-1:1 }
