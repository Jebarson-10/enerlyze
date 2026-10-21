export type OrbitPixel = {x: number; y: number; color: number};

type Paint = (x: number, y: number, width: number, height: number, color: number) => void;

function sprite(draw: (paint: Paint) => void): OrbitPixel[] {
  const cells = new Map<string, OrbitPixel>();
  const paint: Paint = (x, y, width, height, color) => {
    for (let row = y; row < y + height; row++) for (let column = x; column < x + width; column++) {
      if (column >= 0 && column < 16 && row >= 0 && row < 16) {
        cells.set(`${column},${row}`, {x: (column - 7.5) * .052, y: (7.5 - row) * .052, color});
      }
    }
  };
  draw(paint);
  return [...cells.values()];
}

// Pixel silhouettes make energy use, emissions, and alternatives legible at a glance.
export const orbitSprites: OrbitPixel[][] = [
  sprite(p => { // Fan
    p(6, 0, 3, 5, 0x77e7ed); p(7, 1, 1, 3, 0xd8fbff);
    p(10, 5, 5, 3, 0x2daac7); p(11, 6, 3, 1, 0x9ef3f4);
    p(6, 10, 3, 5, 0x44c9d6); p(7, 11, 1, 3, 0xd8fbff);
    p(0, 6, 5, 3, 0x369abc); p(1, 7, 3, 1, 0xa9f5f3);
    p(5, 5, 5, 5, 0x0d648d); p(6, 6, 3, 3, 0xf1fffc);
  }),
  sprite(p => { // Light bulb
    p(5, 1, 6, 2, 0xffe486); p(3, 3, 10, 6, 0xffc538);
    p(4, 4, 3, 3, 0xfff4b6); p(5, 9, 6, 2, 0xffd557);
    p(6, 11, 4, 3, 0xb8a9a0); p(6, 12, 4, 1, 0xf6ede1);
    p(7, 14, 2, 1, 0x687897);
  }),
  sprite(p => { // Emitting industrial appliance
    p(1, 7, 14, 7, 0x8995b3); p(2, 8, 12, 5, 0x536783);
    p(3, 9, 3, 3, 0xff967b); p(7, 9, 3, 3, 0xffc46c); p(11, 9, 2, 3, 0xff967b);
    p(10, 3, 3, 5, 0xb0baca); p(11, 1, 2, 2, 0x8793a5);
    p(10, 0, 1, 1, 0xc4c9d5); p(13, 1, 2, 1, 0xaab2c3);
    p(1, 14, 14, 1, 0x526079);
  }),
  sprite(p => { // Vehicle
    p(2, 7, 12, 5, 0xf56980); p(4, 4, 7, 4, 0xff9b85);
    p(5, 5, 5, 2, 0xa9dfff); p(1, 9, 2, 2, 0xffd86d);
    p(12, 9, 3, 2, 0xffd86d); p(3, 11, 3, 3, 0x333858);
    p(10, 11, 3, 3, 0x333858); p(4, 12, 1, 1, 0xdde5f1);
    p(11, 12, 1, 1, 0xdde5f1);
  }),
  sprite(p => { // Water bottle
    p(6, 0, 4, 2, 0x77d8db); p(5, 2, 6, 2, 0xa9eaf0);
    p(4, 4, 8, 10, 0x5dc5dc); p(5, 5, 2, 7, 0xbdf4f0);
    p(7, 7, 4, 4, 0x247fab); p(4, 14, 8, 1, 0x348caa);
  }),
  sprite(p => { // Solar alternative
    p(1, 3, 14, 9, 0xa7b7e9); p(2, 4, 12, 7, 0x3157bb);
    p(3, 5, 3, 2, 0x75dcf0); p(7, 5, 3, 2, 0x75dcf0); p(11, 5, 2, 2, 0x75dcf0);
    p(3, 8, 3, 2, 0x4e9ddf); p(7, 8, 3, 2, 0x4e9ddf); p(11, 8, 2, 2, 0x4e9ddf);
    p(7, 12, 2, 2, 0xc5ac74); p(5, 14, 6, 1, 0xc5ac74);
  }),
];
