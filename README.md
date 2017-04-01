# r53.js

[![Build Status](https://travis-ci.org/wakayama-hacker/r53.svg?branch=master)](https://travis-ci.org/wakayama-hacker/r53)

r53.js allows you to insert/update DNS records by JSON.

* It can update `A` and `CNAME` records only.

## Getting Started

```
$ git clone git@github.com:wakayama-hacker/r53.git
$ cd r53
$ npm install
```

Edit `config.json`.

Then run `npm run deploy`.

## How to set up

### Create an IAM policy like following

Create an IAM policy on AWS management console like following.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Stmt1490535720000",
            "Effect": "Allow",
            "Action": [
                "route53:ChangeResourceRecordSets",
                "route53:ListResourceRecordSets"
            ],
            "Resource": [
                "arn:aws:route53:::hostedzone/<Your Hosted Zone ID>"
            ]
        }
    ]
}
```

### Update config.json

Update `config.json` like following.

```
{
  "records": [
    {
      "Name": "wacker.io",
      "Type": "A",
      "TTL": "300",
      "ResourceRecords": [
        {
          "Value": "192.30.252.153"
        },
        {
          "Value": "192.30.252.154"
        }
      ]
    },
    {
      "Name": "wmap.wacker.io",
      "Type": "CNAME",
      "TTL": "300",
      "ResourceRecords": [
        {
          "Value": "wakayama-hacker.github.io"
        }
      ]
    },
    {
      "Name": "latlng.wacker.io",
      "Type": "CNAME",
      "TTL": "300",
      "ResourceRecords": [
        {
          "Value": "wakayama-hacker.github.io"
        }
      ]
    },
    {
      "Name": "kushimap.wacker.io",
      "Type": "CNAME",
      "TTL": "300",
      "ResourceRecords": [
        {
          "Value": "miya0001.github.io"
        }
      ]
    }
  ]
}
```

* If you want to delete a record, please delete the entry from `config.json`.
* For more information of the `ResourceRecords`, please see [ for the `changeResourceRecordSets`](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#changeResourceRecordSets-property).

### Add IAM credentials as environment variables into Travis CI

![](https://www.evernote.com/l/ABXLCVDevkdEA515FC0QNX-QPu00Rb0kZIwB/image.png)

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `HOSTED_ZONE_ID`

### Run r53.js

Finally, execute `git push` to run `r53.js`.

or

```
$ npm install
$ npm run deploy
```
