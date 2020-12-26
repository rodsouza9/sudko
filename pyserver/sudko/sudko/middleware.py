class CORSMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        res = self.get_response(request)
        res["Access-Control-Allow-Origin"] = "http://localhost:5000"
        return res
