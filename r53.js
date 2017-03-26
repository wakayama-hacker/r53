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

  config.cname_records.forEach((cname) => {
    const change = {
      Action: 'UPSERT',
      ResourceRecordSet: {
        Name: cname.name,
        ResourceRecords: [
          {
            Value: cname.value
          }
        ],
        TTL: config.ttl,
        Type: 'CNAME'
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

    const cnames = []
    config.cname_records.forEach((cname) => {
      cnames.push(cname.name)
    })

    records.ResourceRecordSets.forEach((record) => {
      if ('CNAME' === record.Type) {
        if (-1 === cnames.indexOf(record.Name.replace(/\.$/, ''))) {
          const change = {
            Action: 'DELETE',
            ResourceRecordSet: record
          }
          params.ChangeBatch.Changes.push(change)
        }
      }
    })

    if (params.ChangeBatch.Changes.length)
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
