const AWS = require('aws-sdk');
const route53 = new AWS.Route53({apiVersion: '2013-04-01'});
const config = require('./config.json')

const params = {
  DNSName: config.domain_name,
  MaxItems: "1"
}

const update_r53 = (HostedZoneId) => {
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

const listHostedZonesByName = route53.listHostedZonesByName(params).promise();

listHostedZonesByName.then((data) => {
  if (data.HostedZones.length) {
    if (config.domain_name + '.' === data.HostedZones[0].Name) {
      const HostedZoneId = data.HostedZones[0].Id;
      update_r53(HostedZoneId);
    }
  } else {
    console.log(`${config.domain_name} doesn't exist.`);
    process.exit(1);
  }
}).catch((err) => {
  console.log(err);
  process.exit(1);
});
