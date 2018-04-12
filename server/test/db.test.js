const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {mon} = require('./../model/blogsmodel');

const mons = [{
  _id: new ObjectID(),
  title: 'NodeJs'
}, {
  _id: new ObjectID(),
  title: 'Angular'
}];

beforeEach((done) => {
 mon.remove({}).then(() => {
    return mon.insertMany(mons);
  }).then(() => done());
});
describe('POST/mons', () => {
  it('should create a new Document', (done) => {
    var title = 'Oracle';
    request(app)
      .post('/mons')
      .send({title})
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(title);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

       mon.find({title}).then((mons) => {
        expect(mons.length).toBe(1);
          expect(mons[0].title).toBe(title);
          done();
        }).catch((e) => done(e));
      });
  });
});
describe('GET/mons', () => {
  it('should get all documents in Blogs Collection', (done) => {
    request(app)
      .get('/mons')
      .expect(200)
      .expect((res) => {
        //console.log(res.body)
        expect(res.body.mons.length).toBe(2);
      })
      .end(done);
  });
});
describe('GET /mons/:id', () => {
  it('should return the document based on id value', (done) => {
    request(app)
      .get(`/mons/${mons[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
       
        expect(res.body.mons.title).toBe(mons[0].title);
      })
      .end(done);
  });
});
describe('GET/mons/:title', () => {
  it('Should find the document based on title', (done) => {
    request(app)
      .get(`/blogs/${mons[0].title}`)
      .expect(200)
      .expect((res) => {
        //console.log(res.body[0].title)
        expect(res.body[0].title).toBe(mons[0].title);
      })
      .end(done);
  });
});
describe('DELETE /mons/:id', () => {
  it('should delete the document based on id value', (done) => {
    var hexId = mons[0]._id.toHexString();

    request(app)
      .delete(`/mons/${hexId}`)
      .expect(200)
      .expect((res) => {
       // console.log(res.body.mons._id)
        expect(res.body.mons._id).toBe(hexId);
      })
        .end(done);
     });
  });
describe('PATCH /mons/:id', () => {
  it('should update the document with given id', (done) => {
    var hexId = mons[1]._id.toHexString();
    var title = 'Java';
    request(app)
      .patch(`/mons/${hexId}`)
      .send({title})
      .expect(200)
      .expect((res) =>{
        console.log(res.body.mons.title)
        expect(res.body.mons.title).toBe(title);
      })
      .end(done);
  });
  });




