const helpRequestFixtures = {
    oneRequest: 
        {
            "id": 1,
            "requesterEmail": "srambhatla@ucsb.edu",
            "teamId": "01",
            "tableOrBreakoutRoom": "01",
            "requestTime": "2022-01-02T12:00:00",
            "explanation": "Dokku problems",
            "solved": true
        },
    threeRequests: [
        {
            "id": 2,
            "requesterEmail": "one@ucsb.edu",
            "teamId": "01",
            "tableOrBreakoutRoom": "01",
            "requestTime": "2022-01-02T12:00:00",
            "explanation": "Dokku issues",
            "solved": true
        },
        {
            "id": 3,
            "requesterEmail": "two@ucsb.edu",
            "teamId": "02",
            "tableOrBreakoutRoom": "02",
            "requestTime": "2022-04-03T12:00:00",
            "explanation": "Swagger problems",
            "solved": false
        },
        {
            "id": 4,
            "requesterEmail": "three@ucsb.edu",
            "teamId": "03",
            "tableOrBreakoutRoom": "03",
            "requestTime": "2022-07-04T12:00:00",
            "explanation": "Merge conflict",
            "solved": true
        }
    ]
};


export { helpRequestFixtures };