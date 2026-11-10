export const CAM_Z = 8; // camera đứng yên ở độ sâu này
export const FOV = 50;

export const SPACING = 7; // khoảng cách dọc giữa 2 ảnh
export const FIRST_Y = 4; // ảnh đầu nằm dưới màn hình đầu một đoạn

export const photoY = (i: number) => -(FIRST_Y + i * SPACING);

export const totalDistance = (count: number) => FIRST_Y + (count - 1) * SPACING;

// tiến độ cuộn (0 → 1) để ảnh thứ i nằm giữa màn hình
export const photoProgress = (i: number, count: number) =>
  (FIRST_Y + i * SPACING) / totalDistance(count);
