trigger PostToChatterTrigger on Trade__c (after insert) {
    if(!Test.isRunningTest()) {
        List<FeedItem> posts = new List<FeedItem>();
        List<CollaborationGroup> tradeReviewersGroups = [SELECT Id, Name FROM CollaborationGroup WHERE Name = 'Trade Reviewers'];
        if (tradeReviewersGroups.size() > 0) {
            for(Trade__c trade : Trigger.New) {
                FeedItem post = new FeedItem();
                post.ParentId = tradeReviewersGroups[0].Id;
                post.Body = 'A new trade has been created with the following data:\nSell Currency: ' + trade.Sell_Currency__c + '\n'+
                                                                                  + 'Sell Amount: ' + trade.Sell_Amount__c + '\n' +
                                                                                  + 'Buy Currency: ' + trade.Buy_Currency__c + '\n' +
                                                                                  + 'Buy Amount: ' + trade.Buy_Amount__c + '\n' +
                                                                                  + 'Rate: ' + trade.Rate__c + '\n' + 
                                                                                  + 'Booked Date: ' + trade.Date_Booked__c + '\n' +
                                                                                  + 'Link to the trade: ' + URL.getSalesforceBaseUrl().toExternalForm() +
                                                                                                          + '/' + trade.Id;
                                                                                  
               posts.add(post);
            }  
        }
        
        insert posts;
    }

}