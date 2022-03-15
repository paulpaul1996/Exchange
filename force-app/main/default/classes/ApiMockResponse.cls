public with sharing class ApiMockResponse implements HttpCalloutMock {
    public HTTPResponse respond(HTTPRequest req) {
        HttpResponse response = new HttpResponse();
        response.setStatusCode(200);
        response.setBody('{"success" : true, "base" : EUR, "rates" : { "CAD" : 1.405, "USD" : 1.096515, "GBP" : 0.842271 }}');
        return response;
    }
}
