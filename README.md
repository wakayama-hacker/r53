# r53.js

[![Build Status](https://travis-ci.org/wakayama-hacker/r53.svg?branch=master)](https://travis-ci.org/wakayama-hacker/r53)

r53.js allows you to insert/update DNS records by JSON.

* It can update `CNAME` records only.

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
  "ttl": "300",
  "cname_records": [
    {
      "name": "wmap.wacker.io",
      "value": "wakayama-hacker.github.io"
    },
    {
      "name": "latlng.wacker.io",
      "value": "wakayama-hacker.github.io"
    },
    {
      "name": "kushimap.wacker.io",
      "value": "miya0001.github.io"
    }
  ]
}
```

If you want to delete a record, please delete the entry from `config.json`.

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
