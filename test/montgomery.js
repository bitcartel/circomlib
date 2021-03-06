const chai = require("chai");
const path = require("path");
const bigInt = require("big-integer");
const tester = require("circom").tester;
const babyJub = require("../src/babyjub.js");

const assert = chai.assert;

describe("Montgomery test", function () {
    let circuitE2M;
    let circuitM2E;
    let circuitMAdd;
    let circuitMDouble;

    let g = [
        bigInt("5299619240641551281634865583518297030282874472190772894086521144482721001553"),
        bigInt("16950150798460657717958625567821834550301663161624707787222815936182638968203")
    ];

    let mg, mg2, g2, g3, mg3;

    this.timeout(100000);
    before( async() => {
        circuitE2M = await tester(path.join(__dirname, "circuits", "edwards2montgomery.circom"));
        await circuitE2M.loadSymbols();
        circuitM2E = await tester(path.join(__dirname, "circuits", "montgomery2edwards.circom"));
        await circuitM2E.loadSymbols();
        circuitMAdd = await tester(path.join(__dirname, "circuits", "montgomeryadd.circom"));
        await circuitMAdd.loadSymbols();
        circuitMDouble = await tester(path.join(__dirname, "circuits", "montgomerydouble.circom"));
        await circuitMDouble.loadSymbols();
    });
    it("Convert Edwards to Montgomery and back again", async () => {
        let w, xout, yout;

        w = await circuitE2M.calculateWitness({ in: g}, true);

        xout = w[circuitE2M.symbols["main.out[0]"].varIdx];
        yout = w[circuitE2M.symbols["main.out[1]"].varIdx];

        mg = [xout, yout];

        w = await circuitM2E.calculateWitness({ in: [xout, yout]}, true);

        xout = w[circuitM2E.symbols["main.out[0]"].varIdx];
        yout = w[circuitM2E.symbols["main.out[1]"].varIdx];

        assert(xout.equals(g[0]));
        assert(yout.equals(g[1]));
    });
    it("Should double a point", async () => {
        let w, xout, yout;

        g2 = babyJub.addPoint(g,g);

        w = await circuitMDouble.calculateWitness({ in: mg}, true);

        xout = w[circuitE2M.symbols["main.out[0]"].varIdx];
        yout = w[circuitE2M.symbols["main.out[1]"].varIdx];

        mg2 = [xout, yout];

        w = await circuitM2E.calculateWitness({ in: mg2}, true);

        xout = w[circuitM2E.symbols["main.out[0]"].varIdx];
        yout = w[circuitM2E.symbols["main.out[1]"].varIdx];

        assert(xout.equals(g2[0]));
        assert(yout.equals(g2[1]));
    });
    it("Should add a point", async () => {
        let w, xout, yout;

        g3 = babyJub.addPoint(g,g2);

        w = await circuitMAdd.calculateWitness({ in1: mg, in2: mg2}, true);

        xout = w[circuitMAdd.symbols["main.out[0]"].varIdx];
        yout = w[circuitMAdd.symbols["main.out[1]"].varIdx];

        mg3 = [xout, yout];

        w = await circuitM2E.calculateWitness({ in: mg3}, true);

        xout = w[circuitM2E.symbols["main.out[0]"].varIdx];
        yout = w[circuitM2E.symbols["main.out[1]"].varIdx];

        assert(xout.equals(g3[0]));
        assert(yout.equals(g3[1]));
    });
});
