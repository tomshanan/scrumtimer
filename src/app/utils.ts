import { tardyNames as allowdNames, tardyNames } from "./app.constants";
import { Participant } from "./settings/settings.component";

export function makeParticipant(name:string, include:boolean = true): Participant {
  return {
    name: name.trim().toLowerCase(),
    include
  }
}

export function shuffle<T>(f:Array<T>): Array<T> {
  let n = f.length,
    o;
  for (; n > 0; )
    (o = Math.floor(Math.random() * n)), n--, ([f[n], f[o]] = [f[o], f[n]]);
  return f;
}

export const getTardyName = (used?: string[])=>{
  let allowedNames = [...tardyNames]
  if(used?.length){
    allowedNames = allowedNames.filter(name => !used.includes(name))
  }
  const rand = Math.floor(Math.random() * allowedNames.length)
  return allowedNames[rand]
}
