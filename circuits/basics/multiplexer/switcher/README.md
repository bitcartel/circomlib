# `Switcher()` 

## Description

This template receives two inputs `L` and `R` and returns the two values switched according to a third boolean input `sel`. 

## Schema

```
           ______________ 
  L ----> |              | ----> outL
sel ----> |  Switcher()  | 
  R ----> |______________| ----> outR    
```

## Dependencies

```
include "../compconstant/compconstant.circom";
```

## Inputs

| Input         | Type           |
| ------------- | -------------  | 
| `sel`         | Boolean      |
| `R`           | TODO: ?      |
| `L`           | TODO: ?      |

## Outputs

| Output        | Type           | Description     |
| ------------- | -------------  | ----------      | 
| `outR`        | TODO: ?         | `outR = R` if `sel == 0` and `outR = L` if `sel == 1`. |
| `outL`        | TODO: ?         | `outL = L` if `sel == 0` and `outL = R` if `sel == 1`. |

## Benchmarks 

## Test