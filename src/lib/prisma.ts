import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = new Proxy({} as ReturnType<typeof prismaClientSingleton>, {
  get(target, prop) {
    if (!globalThis.prismaGlobal) {
      globalThis.prismaGlobal = prismaClientSingleton();
    }
    return (globalThis.prismaGlobal as any)[prop];
  }
});

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma as any;
