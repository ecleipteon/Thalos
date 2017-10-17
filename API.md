**User Login**
----
  <_email address and passowrd to perform the login operations._>

* **URL**

  <_/api/signin_>

* **Method:**

  <_POST_>


*  **URL Params**

   <_Requested parameters are email and password, they will be protect by the TLS layer_>

   **Required:**

   `email=[string]`  <br />
   `password=[string]`

* **Data Params**

  <_Username and password parameters will by protected by the TLS layer._>

* **Success Response:**

  <_In case of success the request will be redirected to the dashboard page. Please see the dashboard success Response_>

  * **Code:** 200 <br />
    **Content:** `{ id : 12 }`

* **Error Response:**

  <_Error can be thrown either if the user does not exist, the password is wrong or the account has not been activated yet._>

  * **Code:** 200 OK <br />
    **Content:** `{ error : "Log in" }`

* **Notes:**

  <_Parameters are passed in clear, please remind to use this call over a TLS layer!_>
