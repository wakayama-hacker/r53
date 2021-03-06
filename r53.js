const AWS = require('aws-sdk');
const route53 = new AWS.Route53({apiVersion: '2013-04-01'});
const config = require('./config.json')

const update_record = (HostedZoneId) => {
  const params = {
    HostedZoneId: HostedZoneId,
    ChangeBatch: {
      Changes: [],
      Comment: "Updated by r53.js"
    }
  }

  config.records.forEach((record) => {
    const change = {
      Action: 'UPSERT',
      ResourceRecordSet: {
        Name: record.Name,
        ResourceRecords: record.ResourceRecords,
        TTL: record.TTL,
        Type: record.Type
      }
    }
    params.ChangeBatch.Changes.push(change)
  })

  const promise = route53.changeResourceRecordSets(params).promise();
  promise.then((data) => {
    console.log(data)
  }).catch((err) => {
    console.log(err);
    process.exit(1);
  });
}

const delete_record = (HostedZoneId) => {
  const params = {
    HostedZoneId: HostedZoneId
  }
  const promise = route53.listResourceRecordSets(params).promise();
  promise.then((records) => {
    const params = {
      HostedZoneId: HostedZoneId,
      ChangeBatch: {
        Changes: [],
        Comment: "Deleted by r53.js"
      }
    }

    const names = []
    config.records.forEach((record) => {
      names.push(record.Name)
    })

    records.ResourceRecordSets.forEach((record) => {
      if ('CNAME' === record.Type || 'A' === record.Type) {
        if (-1 === names.indexOf(record.Name.replace(/\.$/, ''))) {
          const change = {
            Action: 'DELETE',
            ResourceRecordSet: record
          }
          params.ChangeBatch.Changes.push(change)
        }
      }
    })

    if (params.ChangeBatch.Changes.length) {
      const promise = route53.changeResourceRecordSets(params).promise();
      promise.then((data) => {
        console.log(data)
      }).catch((err) => {
        console.log(err);
        process.exit(1);
      });
    }
  }).catch((err) => {
    console.log(err);
    process.exit(1);
  });
}

update_record(process.env.HOSTED_ZONE_ID)
delete_record(process.env.HOSTED_ZONE_ID)
