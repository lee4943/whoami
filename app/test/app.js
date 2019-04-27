// express server import
const app = require("..");

// chai imports/config
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

// tests I'll finish someday!
// TODO - actually finish these tests
describe("Login", () =>{
    describe("GET /", () => {
        it("should present a login page", (done) => {
            chai.request(app)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                done();
            });
        });
    });
});