import supertest from 'supertest';
import should from 'should';

let server = supertest.agent("http://localhost:5000");

/*
    GENERAL API TESTING
    -------------------
*/

describe("GET /badlink", () => {
    it("Should return 404", (done) => {
        server
        .get("/invalid")
        .expect(404)
        .end(function(err,res){
            if (err) {
                done(err);
            }
            res.status.should.equal(404);
            done();
        });
    });
});

describe("GET /", () => { 
    it("Should return \'Server is ready\'", (done) => {
        server.get("/")
        .expect("Content-type", "text/html; charset=utf-8")
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            done();
        });
    });
});

/*
    STOCK API TESTING
    -----------------
*/

describe("DELETEALL /api/stock", () => {
    it("Should delete all stocks from the DB to prep for further tests", (done) => {
        server.delete('/api/stock/remove/all')
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.message.should.equal("All stocks have been deleted")
            res.body.success.should.equal(true);
            done();
        });
    });
});

let s1Id = '';
let s2Id = '';
let s3Id = '';
let s4Id = '';
let s5Id = '';

describe("POST /api/stock", () => {
    // Create 5 stocks to use in further testing
    it("Should create a new stock, status 200, success: true, message: stock", (done) => {
        server.post('/api/stock/')
        .send({
            "code": "GMT",
            "value": 5
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            s1Id = res.body.message._id;
            res.body.message.should.have.property("code");
            res.body.message.should.have.property("value");
            done();
        });
    });
    // Server has fatal error here -> Doesnt crash on repeat in user so idk why
    it("Should not create a new stock, status 401, success: false, error: err", (done) => {
        server.post('/api/stock/')
        .send({
            "code": "GMT",
            "value": 5
        })
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.should.have.property("error");
            done();
        });
    });
    it("Should create a new stock, status 401, success: false, error: err", (done) => {
        server.post('/api/stock/')
        .send({
            "code": "GM",
            "value": 5
        })
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.should.have.property("error");
            done();
        });
    });
    it("Should create a new stock, status 200, success: true, message: stock", (done) => {
        server.post('/api/stock/')
        .send({
            "code": "ABC",
            "value": 5
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            s2Id = res.body.message._id;
            res.body.message.should.have.property("code");
            res.body.message.should.have.property("value");
            done();
        });
    });
    it("Should create a new stock, status 200, success: true, message: stock", (done) => {
        server.post('/api/stock/')
        .send({
            "code": "DER",
            "value": 5
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            s3Id = res.body.message._id;
            res.body.message.should.have.property("code");
            res.body.message.should.have.property("value");
            done();
        });
    });
    it("Should create a new stock, status 200, success: true, message: stock", (done) => {
        server.post('/api/stock/')
        .send({
            "code": "CAM",
            "value": 5
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            s4Id = res.body.message._id;
            res.body.message.should.have.property("code");
            res.body.message.should.have.property("value");
            done();
        });
    });
    it("Should create a new stock, status 200, success: true, message: stock", (done) => {
        server.post('/api/stock/')
        .send({
            "code": "REZ",
            "value": 5
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            s5Id = res.body.message._id;
            res.body.message.should.have.property("code");
            res.body.message.should.have.property("value");
            done();
        });
    });
});

describe("DELETE ONE /api/stock", () => {
    it("Should delete stock REZ from the DB", (done) => {
        server.delete(`/api/stock/${s5Id}`)
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.message.should.equal("Stock has been deleted")
            res.body.success.should.equal(true);
            done();
        });
    });

    it("Should throw error because REZ is already deleted", (done) => {
        server.delete(`/api/stock/${s5Id}`)
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.error.should.equal("Stock doesn't exist in db")
            res.body.success.should.equal(false);
            done();
        });
    });
});

describe("PUT/UPDATE Value /api/stock", () => {
    it("Should edit GMT stock to have new value", (done) => {
        server.put(`/api/stock/value/${s1Id}`)
        .send({
            "value": 10
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.message.should.equal("Stock successfully updated")
            res.body.success.should.equal(true);
            done();
        });
    });

    it("Should throw error because REZ is already deleted", (done) => {
        server.put(`/api/stock/value/${s5Id}`)
        .send({
            "value": 7
        })
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.error.should.equal("Stock doesn't exist")
            res.body.success.should.equal(false);
            done();
        });
    });

    it("Should throw error because of invalid value", (done) => {
        server.put(`/api/stock/value/${s1Id}`)
        .send({
            "value": -10
        })
        .expect("Content-type", /json/)
        .expect(403)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(403);
            res.body.error.should.equal("Invalid stock value")
            res.body.success.should.equal(false);
            done();
        });
    });
});

describe("GET /api/stock", () => {
    it("Should get GMT stock", (done) => {
        server.get(`/api/stock/${s1Id}`)
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.message.should.have.property("code");
            res.body.message.code.should.equal("GMT");
            res.body.message.value.should.equal(10);
            res.body.success.should.equal(true);
            done();
        });
    });

    it("Should throw error when get REZ stock", (done) => {
        server.get(`/api/stock/${s5Id}`)
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.error.should.equal("Stock with that Id doesn't exist");
            res.body.success.should.equal(false);
            done();
        });
    });

    it("Should get GMT stock", (done) => {
        server.get(`/api/stock/code/GMT`)
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.message.should.have.property("code");
            res.body.message.code.should.equal("GMT");
            res.body.message.value.should.equal(10);
            res.body.success.should.equal(true);
            done();
        });
    });

    it("Should throw error when get REZ stock", (done) => {
        server.get(`/api/stock/code/REZ`)
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.error.should.equal("Stock with that Id doesn't exist");
            res.body.success.should.equal(false);
            done();
        });
    });
});


/*
    USER API TESTING
    ----------------
*/

let t1_id = "";
let t2_id = "";
let t3_id = "";



describe("DELETEALL /api/user", () => {
    it("Should delete all users from DB to prep for tests; return: success: true, message: All users have been deleted", (done) =>{
        server.delete("/api/user/remove/all")
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.message.should.equal("All users have been deleted")
            res.body.success.should.equal(true);
            done();
        });
    });
});

describe("POST/AUTH Routes /api/user", () => {  // Returns status and success or fail + reason
    //Register success and errors
    it("Should return success: true, _id, name, token", (done) => {
        server.post("/api/user/register")
        .send({
            "name": "TestUser1",
            "password": "123"
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.should.have.property('_id');
            t1_id = res.body._id;  // Assign to global var for later int tests
            res.body.should.have.property('token');
            res.body.success.should.equal(true);
            res.body.name.should.equal("TestUser1");
            done();
        });
    });

    it("Should return 403 success: false, error: Username and Password must not contain spaces", (done) => {
        server.post("/api/user/register")
        .send({
            "name": "Test User 1",
            "password": "123"
        })
        .expect("Content-type", /json/)
        .expect(403)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(403);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Username and Password must not contain spaces");
            done();
        });
    });

    it("Should return 403 success: false, error: Username and Password must not contain spaces", (done) => {
        server.post("/api/user/register")
        .send({
            "name": "TestUser1",
            "password": "1 2 3"
        })
        .expect("Content-type", /json/)
        .expect(403)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(403);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Username and Password must not contain spaces");
            done();
        });
    });

    //Register 2nd account for update testing
    it("Should return success: true, _id, name, token", (done) => {
        server.post("/api/user/register")
        .send({
            "name": "TestUser2",
            "password": "123"
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.should.have.property('_id');
            t2_id = res.body._id;
            res.body.should.have.property('token');
            res.body.success.should.equal(true);
            res.body.name.should.equal("TestUser2");
            done();
        });
    });

    it("Should return success: true, _id, name, token", (done) => {
        server.post("/api/user/register")
        .send({
            "name": "TestUser3",
            "password": "123"
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.should.have.property('_id');
            t3_id = res.body._id;
            res.body.should.have.property('token');
            res.body.success.should.equal(true);
            res.body.name.should.equal("TestUser3");
            done();
        });
    });

    // Also throws server error, doesnt lead to complete crash though
    it("Should return success: false, err: user E11000 duplicate key...", (done) => {
        server.post("/api/user/register")
        .send({
            "name": "TestUser1",
            "password": "123"
        })
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.err.should.equal("E11000 duplicate key error collection: leapgrad_stocks.users index: name_1 dup key: { name: \"TestUser1\" }");
            done();
        });
    });

    //Signin success and errors
    it("Should return success: true, _id, name, token", (done) => {
        server.post("/api/user/signin")
        .send({
            "name": "TestUser1",
            "password": "123"
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.should.have.property('_id');
            res.body.should.have.property('token');
            res.body.success.should.equal(true);
            res.body.name.should.equal("TestUser1");
            done();
        });
    });

    it("Should return success: false, error: Invalid Username", (done) => {
        server.post("/api/user/signin")
        .send({
            "name": "DoesntExist",
            "password": "123"
        })
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("User doesn't exist");
            done();
        });
    });

    it("Should return success: false, error: Invalid Password", (done) => {
        server.post("/api/user/signin")
        .send({
            "name": "TestUser1",
            "password": "InvalidPassword"
        })
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Invalid Password");
            done();
        });
    });

    it("Should return success: false, error: Missing Username or Password", (done) => {
        server.post("/api/user/signin")
        .send({
            "password": "123"
        })
        .expect("Content-type", /json/)
        .expect(400)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(400);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Missing Username or Password");
            done();
        });
    });

    it("Should return success: false, message: Missing Username or Password", (done) => {
        server.post("/api/user/signin")
        .send({
            "username": "TestUser1"
        })
        .expect("Content-type", /json/)
        .expect(400)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(400);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Missing Username or Password");
            done();
        });
    });
    it("Should return success: false, message: Missing Username or Password", (done) => {
        server.post("/api/user/signin")
        .send({})
        .expect("Content-type", /json/)
        .expect(400)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(400);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Missing Username or Password");
            done();
        });
    });
});

describe("DELETE /api/user/:id", () => {
    it("Should return 200 success: true message: Account has been deleted", (done) => {
        server.delete(`/api/user/${t3_id}`)
        .send({
            "id": t3_id
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.equal("Account has been deleted");
            done();
        });
    });
});

describe("UPDATE /api/user/:id", () => {
    it("Should return 401 success: false, error: You can only update your own account", (done) => {
        server
        .put(`/api/user/${t1_id}`)
        .send({"id": `${t2_id}`})
        .expect(401)
        .end(function(err,res){
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.error.should.equal("You can only update your own account");
            done();
        });
    });

    it("Should return 403 success: false, error: Username must not contain spaces", (done) => {
        server
        .put(`/api/user/${t1_id}`)
        .send({"id": `${t1_id}`, "name": "Test User"})
        .expect(403)
        .end(function(err,res){
            if (err) {
                done(err);
            }
            res.status.should.equal(403);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Username must not contain spaces");
            done();
        });
    });

    it("Should return 403 success: false, error: Password must not contain spaces", (done) => {
        server
        .put(`/api/user/${t1_id}`)
        .send({"id": `${t1_id}`, "name": "TestUser", "password": "1 2 3"})
        .expect(403)
        .end(function(err,res){
            if (err) {
                done(err);
            }
            res.status.should.equal(403);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Password must not contain spaces");
            done();
        });
    });

    it("Should return 200 success: true, message: User successfully updated", (done) => {
        server
        .put(`/api/user/${t1_id}`)
        .send({"id": `${t1_id}`, "name": "TestUser", "password": "1234"})
        .expect(200)
        .end(function(err,res){
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.equal("User successfully updated");
            done();
        });
    });

    it("Should return success: true, _id, name, token (Test if new pass and name work)", (done) => {
        server.post("/api/user/signin")
        .send({
            "name": "TestUser",
            "password": "1234"
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.should.have.property('_id');
            t1_id = res.body._id;
            res.body.should.have.property('token');
            res.body.success.should.equal(true);
            res.body.name.should.equal("TestUser");
            done();
        });
    });

    // ADD TO WALLET

    it("Should return success: true, message: Wallet successfully updated", (done) => {
        server.put(`/api/user/add/wallet/${t1_id}`)
        .send({
            "amount": 500,
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.equal("Wallet successfully updated");
            done();
        });
    });

    it("Should return success: true, message: Wallet successfully updated", (done) => {
        server.put(`/api/user/add/wallet/${t1_id}`)
        .send({
            "amount": 200.23,  // wallet goes to 700.23 (200.23+500)
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.equal("Wallet successfully updated");
            done();
        });
    });

    it("Should return success: false, error: You can only update your own wallet", (done) => {
        server.put(`/api/user/add/wallet/${t1_id}`)
        .send({
            "amount": 200.23,
            "id": t2_id
        })
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.error.should.equal("You can only update your own wallet");
            done();
        });
    });

    it("Should return success: false, error: You cannot add a negative value to wallet", (done) => {
        server.put(`/api/user/add/wallet/${t1_id}`)
        .send({
            "amount": -500,
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(403)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(403);
            res.body.success.should.equal(false);
            res.body.error.should.equal("You cannot add a negative value to wallet");
            done();
        });
    });

    it("Should return success: false, error: User doesn't exist", (done) => {
        server.put(`/api/user/add/wallet/${t3_id}`)
        .send({
            "amount": 500,
            "id": t3_id
        })
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("User doesn't exist");
            done();
        });
    });

    it("Should return success: false, error: You can only update your own wallet", (done) => {
        server.put(`/api/user/add/wallet/${t1_id}`)
        .send({
            "amount": 500,
            "id": t3_id
        })
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.error.should.equal("You can only update your own wallet");
            done();
        });
    });

    // BUY AND SELL STOCK

    // BUY
    it("Should return success: true, message: Share purchase successful", (done) => {
        server.put(`/api/user/buy/stock/${t1_id}`)
        .send({
            "code": "GMT",
            "amount": 5,
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.equal("Share purchase successful");
            done();
        });
    });

    it("Should return success: true, message: Share purchase successful", (done) => {
        server.put(`/api/user/buy/stock/${t1_id}`)
        .send({
            "code": "GMT",
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.equal("Share purchase successful");
            done();
        });
    });

    it("Should return success: false, error: Insufficient Funds", (done) => {
        server.put(`/api/user/buy/stock/${t1_id}`)
        .send({
            "code": "GMT",
            "amount": 10000,
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Insufficient funds");
            done();
        });
    });

    it("Should return success: false, error: User doesn't exist", (done) => {
        server.put(`/api/user/buy/stock/${t3_id}`)
        .send({
            "code": "GMT",
            "amount": 10000,
            "id": t3_id
        })
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("User doesn't exist");
            done();
        });
    });

    it("Should return success: false, error: Requested stock doesn't exist", (done) => {
        server.put(`/api/user/buy/stock/${t1_id}`)
        .send({
            "code": "WOW",
            "amount": 10000,
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Requested stock doesn't exist");
            done();
        });
    });

    it("Should return success: false, error: You can only buy stocks for your own account", (done) => {
        server.put(`/api/user/buy/stock/${t1_id}`)
        .send({
            "code": "GMT",
            "amount": 10000,
            "id": t3_id
        })
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.error.should.equal("You can only buy stocks for your own account");
            done();
        });
    });

    // SELL
    it("Should return success: true, message: Shares successfully sold", (done) => {
        server.put(`/api/user/sell/stock/${t1_id}`)
        .send({
            "code": "GMT",
            "amount": 3,
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.equal("Shares successfully sold");
            done();
        });
    });

    it("Should return success: true, message: Shares successfully sold", (done) => {
        server.put(`/api/user/sell/stock/${t1_id}`)
        .send({
            "code": "GMT",
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.equal("Shares successfully sold");
            done();
        });
    });

    it("Should return success: false, error: User doesn't exist", (done) => {
        server.put(`/api/user/sell/stock/${t3_id}`)
        .send({
            "code": "GMT",
            "amount": 10000,
            "id": t3_id
        })
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("User doesn't exist");
            done();
        });
    });

    it("Should return success: false, error: Requested stock doesn't exist", (done) => {
        server.put(`/api/user/sell/stock/${t1_id}`)
        .send({
            "code": "WOW",
            "amount": 10000,
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Requested stock doesn't exist");
            done();
        });
    });

    it("Should return success: false, error: You can only sell stocks for your own account", (done) => {
        server.put(`/api/user/sell/stock/${t1_id}`)
        .send({
            "code": "GMT",
            "amount": 10000,
            "id": t3_id
        })
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.error.should.equal("You can only sell stocks for your own account");
            done();
        });
    });

    it("Should return success: false, error: You can't sell shares you don't own", (done) => {
        server.put(`/api/user/sell/stock/${t1_id}`)
        .send({
            "code": "GMT",
            "amount": 10000,
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.error.should.equal("You can't sell shares you don't own");
            done();
        });
    });
    // Works perfect, t1_id ends with 680 wallet and 2 GMT shares

    // SUBSCRIBE AND UNSUBSCRIBE

    // SUBSCRIBE

    it("Should return success: true, message: Endpoint successfully subscribed to", (done) => {
        server.put(`/api/user/subscribe/${t1_id}`)
        .send({
            "code": "GMT",
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.equal("Endpoint successfully subscribed to");
            done();
        });
    });

    it("Should return success: false, message: You already subscribe to this endpoint", (done) => {
        server.put(`/api/user/subscribe/${t1_id}`)
        .send({
            "code": "GMT",
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(403)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(403);
            res.body.success.should.equal(false);
            res.body.error.should.equal("You already subscribe to this endpoint");
            done();
        });
    });

    it("Should return success: false, message: Endpoint doesn't exist", (done) => {
        server.put(`/api/user/subscribe/${t1_id}`)
        .send({
            "code": "WOW",
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Endpoint doesn't exist");
            done();
        });
    });

    it("Should return success: false, message: User doesn't exist", (done) => {
        server.put(`/api/user/subscribe/${t3_id}`)
        .send({
            "code": "GMT",
            "id": t3_id
        })
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("User doesn't exist");
            done();
        });
    });

    it("Should return success: false, message: You can only edit your own subscriptions", (done) => {
        server.put(`/api/user/subscribe/${t1_id}`)
        .send({
            "code": "GMT",
            "id": t3_id
        })
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.error.should.equal("You can only edit your own subscriptions");
            done();
        });
    });

    // UNSUBSCRIBE

    it("Should return success: true, message: Endpoint successfully unsubscribed to", (done) => {
        server.put(`/api/user/unsubscribe/${t1_id}`)
        .send({
            "code": "GMT",
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.equal("Endpoint successfully unsubscribed to");
            done();
        });
    });

    it("Should return success: false, message: You aren't subscribed to this endpoint", (done) => {
        server.put(`/api/user/unsubscribe/${t1_id}`)
        .send({
            "code": "GMT",
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(403)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(403);
            res.body.success.should.equal(false);
            res.body.error.should.equal("You aren't subscribed to this endpoint");
            done();
        });
    });

    it("Should return success: false, message: Endpoint doesn't exist", (done) => {
        server.put(`/api/user/unsubscribe/${t1_id}`)
        .send({
            "code": "WOW",
            "id": t1_id
        })
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("Endpoint doesn't exist");
            done();
        });
    });

    it("Should return success: false, message: User doesn't exist", (done) => {
        server.put(`/api/user/unsubscribe/${t3_id}`)
        .send({
            "code": "GMT",
            "id": t3_id
        })
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("User doesn't exist");
            done();
        });
    });

    it("Should return success: false, message: You can only edit your own subscriptions", (done) => {
        server.put(`/api/user/unsubscribe/${t1_id}`)
        .send({
            "code": "GMT",
            "id": t3_id
        })
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.error.should.equal("You can only edit your own subscriptions");
            done();
        });
    });

});

// USER GET TESTS

describe("GET Tests for User api/user", () => {
    // PORTFOLIO
    it("Should get the portfolio map of user successfully", (done) => {
        server.get(`/api/user/portfolio/${t1_id}`)
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.should.have.property("message");
            done();
        });
    });
    it("Should throw 406 because user doesnt exist", (done) => {
        server.get(`/api/user/portfolio/${t3_id}`)
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("User doesn't exist")
            done();
        });
    });
    // WALLET
    it("Should get user wallet successfully", (done) => {
        server.get(`/api/user/wallet/${t1_id}`)
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.should.have.property("message");
            done();
        });
    });
    it("Should return success: false error: User doesn't exist", (done) => {
        server.get(`/api/user/wallet/${t3_id}`)
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("User doesn't exist")
            done();
        });
    });

    // USER INFO
    it("Should return success: true message: UserInfo (Not password)", (done) => {
        server.get(`/api/user/${t1_id}`)
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.should.have.property("message");
            res.body.message.should.have.property("name");
            done();
        });
    });
    it("Should return success: false error: User doesn't exist", (done) => {
        server.get(`/api/user/${t3_id}`)
        .expect("Content-type", /json/)
        .expect(406)
        .end((err, res) => {
            if (err) {
                done(err);
            }
            res.status.should.equal(406);
            res.body.success.should.equal(false);
            res.body.error.should.equal("User doesn't exist")
            done();
        });
    });

});