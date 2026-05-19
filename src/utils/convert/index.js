// 使用工厂函数（factory）创建类似 struct 的对象
export function Quat (w = 0, x = 0, y = 0, z = 0) {
  return {
    w,
    x,
    y,
    z
  }
}

// 或者使用类（更接近 C# struct）
export class QuatStruct {
  constructor(w = 0, x = 0, y = 0, z = 0) {
    this.w = w
    this.x = x
    this.y = y
    this.z = z
  }
}
