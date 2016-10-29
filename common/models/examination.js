module.exports = function(Examination) {

  Examination.remoteMethod(
    'insertTestData',
    {
      description: 'Insert sample data set of test examinations.',
      http: {path: '/insertTestData', verb: 'post'},
      returns: {arg: 'insertCount', type: 'number'}
    }
  );

  Examination.insertTestData = function(cb) {
    const parse = require('csv-parse');
    const fs = require('fs');
    const materialPaletts = require('google-material-color').palette;
    delete materialPaletts['White'];
    delete materialPaletts['Black'];
    delete materialPaletts['Grey'];
    const keys = Object.keys(materialPaletts);
    const testData = './test/data/CMS32_DESC_LONG_SHORT_SG.csv';
    var examinations = [];
    var header = true;

    fs.createReadStream(testData)
    .pipe(parse())
    .on('data', function(csvrow) {
      if (header) {
        header = false;
        return;
      }
      examinations.push({
        name: csvrow[1],
        createdBy: 0,
        created: Date.now(),
        modifiedBy: 0,
        modified: Date.now(),
        backgroundColor: materialPaletts[keys[ keys.length * Math.random() << 0]]['500'],
        color: '#FFFFFF',
        duration: possibleDurations[Math.floor(Math.random() * possibleDurations.length)]
      });
    })
    .on('end',function() {
      console.log('Finished reading from csv.');
      Examination.create(examinations, function(err, models) {
        if (err) {
          cb(err);
        } else {
          cb(null, models.length);
        }
      });
    })
    .on('error', function(error) {
      cb(error);
    });
  }

  Examination.deleteAllExaminations = function(cb) {
    Examination.destroyAll(null, function(err, info) {
      if (err) {
        cb(err);
      } else {
        cb(null, parseInt(info.count));
      }
    });
  }

  Examination.remoteMethod(
    'deleteAllExaminations',
    {
      description: 'Deletes all data.',
      http: {path: '/deleteAll', verb: 'delete'},
      returns: {arg: 'deletedCount', type: 'number'}
    }
  );

  const possibleDurations = ['PT20M', 'PT30M', 'PT40M', 'PT1H', 'PT1H30M', 'PT2H'];

};
