# Getting Started

## Requirements

- **Node.js** >= 20
- **npm** >= 10

## Install

To run bytecode you need the interpreter and the byte helpers:

::: code-group

```bash [npm]
npm install @tvmjs/tvm @tvmjs/util
```

```bash [pnpm]
pnpm add @tvmjs/tvm @tvmjs/util
```

```bash [yarn]
yarn add @tvmjs/tvm @tvmjs/util
```

:::

The [transaction example](#run-a-transaction) below needs three more — the execution context, the
chain configuration and the transaction types:

::: code-group

```bash [npm]
npm install @tvmjs/vm @tvmjs/common @tvmjs/tx
```

```bash [pnpm]
pnpm add @tvmjs/vm @tvmjs/common @tvmjs/tx
```

```bash [yarn]
yarn add @tvmjs/vm @tvmjs/common @tvmjs/tx
```

:::

See [Packages](/packages/) for the full list and what each one covers.

## Run some bytecode

The smallest useful program: push `1` onto the stack and read back the energy spent.

```ts
import { createTVM } from '@tvmjs/tvm';
import { hexToBytes } from '@tvmjs/util';

const main = async () => {
  const tvm = await createTVM();
  const res = await tvm.runCode({ code: hexToBytes('0x6001') }); // PUSH1 01
  console.log(res.executionGasUsed); // 3n
};

void main();
```

::: tip The default chain is TRON
With no explicit `Common`, `createTVM()` and `createVM()` use the execution-only `TronMainnet`
configuration (chainId `728126428`, hardfork `tron`). This changed in 1.1.0 — see
[Chain Configuration](/guide/chain-configuration).
:::

## Run a transaction

`@tvmjs/vm` adds the transaction and block layer on top of the interpreter.

```ts
import { Common, Hardfork, Mainnet } from '@tvmjs/common';
import { createLegacyTx } from '@tvmjs/tx';
import { createZeroAddress } from '@tvmjs/util';
import { createVM, runTx } from '@tvmjs/vm';

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai });
  const vm = await createVM({ common });

  const tx = createLegacyTx({
    gasLimit: BigInt(21000),
    gasPrice: BigInt(1000000000),
    value: BigInt(1),
    to: createZeroAddress(),
    v: BigInt(37),
    r: BigInt('62886504200765677832366398998081608852310526822767264927793100349258111544447'),
    s: BigInt('21948396863567062449199529794141973192314514851405455194940751428901681436138'),
  });

  const res = await runTx(vm, { tx, skipBalance: true });
  console.log(res.totalGasSpent); // 21000n
};

void main();
```

::: warning Transactions must share the VM's Common
EIP-155 and typed transactions whose chainId differs from the VM are rejected. Build them with the
VM's instance — `createLegacyTx(data, { common: vm.common })`. Unprotected legacy transactions carry
no chainId and remain accepted.
:::

## Watch execution as it runs

Every instruction emits a `step` event, which is the quickest way to see what the interpreter is
doing:

```ts
import { createTVM } from '@tvmjs/tvm';
import { bytesToHex, hexToBytes } from '@tvmjs/util';
import type { PrefixedHexString } from '@tvmjs/util';

const main = async () => {
  const tvm = await createTVM();

  const STOP = '00';
  const ADD = '01';
  const PUSH1 = '60';
  const code = [PUSH1, '03', PUSH1, '05', ADD, STOP];

  tvm.events.on('step', (data) => {
    // data.stack is a live reference to the interpreter's stack, not a copy
    console.log(`Opcode: ${data.opcode.name}\tStack: ${data.stack}`);
  });

  const results = await tvm.runCode({
    code: hexToBytes(('0x' + code.join('')) as PrefixedHexString),
    gasLimit: BigInt(0xffff),
  });

  console.log(`Returned: ${bytesToHex(results.returnValue)}`);
  console.log(`gasUsed: ${results.executionGasUsed.toString()}`);
};

void main();
```

See [Events and Tracing](/guide/events-and-tracing) for the full event list.

## Next steps

- [Chain Configuration](/guide/chain-configuration) — picking TRON or Ethereum rules, hardforks and
  network proposals.
- [Executing Code](/guide/execution) — which of `runCode`, `runCall`, `runTx` and `runBlock` you want.
- [TRON Semantics](/tron/overview) — the behaviour that differs from the EVM.
