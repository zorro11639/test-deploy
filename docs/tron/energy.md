# Energy Model

TRON meters execution in **energy** rather than gas. The accounting shape is the same; the
parameters are not.

## Parameters

| Parameter              | Ethereum               | TRON                              |
| ---------------------- | ---------------------- | --------------------------------- |
| Metering unit          | gas                    | energy                            |
| Stack limit            | 1024                   | **64**                            |
| Call/create forwarding | EIP-150 (63/64 rule)   | full available energy (version 0) |
| Contract deployment    | EIP-3860 word metering | `200 × code length + base`        |
| Runtime code size      | EIP-170 limit          | no limit                          |
| Initcode size          | EIP-3860 limit         | no limit                          |

Every TRON-specific opcode has its own energy cost.

## The 64-slot stack

This is the difference most likely to surprise you. Bytecode that compiles and runs on the EVM can
overflow TRON's stack — deep expression trees and large inline structs are the usual causes. A
contract that works in an Ethereum test suite is not automatically valid on TRON.

## Energy forwarding

TRON version-0 `CALL` and `CREATE` forward the **full available energy** to the callee, where
Ethereum reserves 1/64 for the caller. A contract that relies on having energy left after a failing
subcall behaves differently on the two chains.

Ethereum EIP-150 forwarding is preserved on Ethereum hardfork paths.

## Size limits are lifted

Ethereum's EIP-170 runtime-size limit and EIP-3860 initcode-size limit and word metering do **not**
apply on TRON chain profiles — independently of the selected hardfork. Code-deposit energy and the
other deployment validation are unchanged.

This is chain-level, so it holds whenever `Common.isTron()` is true.

## Where TIP-854 charges everything

Under Proposal 96 / Osaka, invalid calldata to the `0x09` and `0x0a`
[precompiles](/tron/precompiles) consumes the complete forwarded energy rather than refunding the
remainder.
