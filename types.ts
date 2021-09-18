export type TowerDefinition = {
   name: string,
   attackSpeed: number,
   range: number,
   cost: number,
   projectile: ProjectileDefinition
}

export type ProjectileDefinition = {
   speed: number
   damage: number
   texture: string;
   splashDamage?: number
   splashRange?: number
}