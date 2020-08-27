import Responses from "../helpers/responses";

class CommonMiddleware {
	static validId = async (req, res, next) => {
		const id = req.params.id;

		if (id.length === 24) {
			next();
		} else {
			return Responses.error(res, 400, "The provided id is incorrect");
		}
	};

	static hasContents = async (req, res, next) => {
		if (!Object.keys(req.body).length) {
			return Responses.error(res, 400, "You must provide the contents");
		} else {
			next();
		}
	};

	static validRequest = async (err, req, res, next) => {
    	console.log('i was here, before')
    if (err) {
    	console.log('i was here')
      return Responses.error(res, err.status, err.message);
    }
    next();
  }
}

export default CommonMiddleware;
