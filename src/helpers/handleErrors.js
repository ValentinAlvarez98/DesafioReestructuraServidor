export function validateFields(data, fieldsToValidate) {

      return fieldsToValidate.every(field => data[field]);

}


export function validateData(condition, res, error) {

      if (condition) {

            res.status(404).send({
                  status: 'error',
                  message: error
            });

            throw new Error(error);

      };

}

export function validateDataDB(condition, message) {

      if (condition) {
            console.log(message)
            throw new Error(message);
      };

}

export function handleTryErrorDB(error) {

      console.log(error);

}

export function handleTryError(res, error) {

      res.status(500).send({
            status: 'error',
            message: 'Error en el servidor'
      });

      console.log(error);

};

export function phoneOptions(oldPhone, newPhone) {

      if (newPhone === "0") {

            return null;

      } else if (newPhone === undefined) {

            return oldPhone;

      } else if (newPhone === oldPhone) {

            return oldPhone;

      } else {

            return newPhone;

      };

};