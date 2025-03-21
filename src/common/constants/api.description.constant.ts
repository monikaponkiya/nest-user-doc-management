export const USER = {
  LOGIN: {
    summary: 'User Login',
    description: `
          Authenticates a user and returns an access token.
          
          **Access**: Only users with the ADMIN, EDITOR and VIEWER role can access this endpoint.
          
          **Request Body**:
          - The request body must contain the email and password fields.
          
          **Response**:
          - Returns the access token.
        `,
  },
  REGISTER: {
    summary: 'User Registration',
    description: `
            Regiter user in system.

            **Access**: Only users with the ADMIN, EDITOR and VIEWER role can access this endpoint.
          
            **Request Body**:
            - The request body must contain the name, email, password and role fields.

            **Response**:
            - Returns the success message.
        `,
  },
  CHANGE_PASSWORD: {
    summary: 'User Change Password',
    description: `
          Changes the password of a user.
          
          **Access**: Only users with the ADMIN, EDITOR and VIEWER role can access this endpoint.
          
          **Request Body**:
          - The request body must contain the id, oldPassword and newPassword fields.
          
          **Response**:
          - Returns a confirmation of the password change.
        `,
  },
  CREATE: {
    summary: 'Create User',
    description: `
          Creates a new user in the system.
          
          **Access**: Only users with the ADMIN role can access this endpoint.
          
          **Request Body**:
          - The request body must contain all required fields defined in the CreateUserDto.
          
          **Response**:
          - Returns the created user information, including ID, name, email and role.
        `,
  },
  UPDATE: {
    summary: 'Update User',
    description: `
          Updates the information of an existing user.
          
          **Access**: Only users with the ADMIN, EDITOR role can access this endpoint.
          
          **Parameters**:
          - The ID of the user to be updated is provided in the URL path.
          
          **Request Body**:
          - The request body must contain the updated fields defined in the UpdateUserDto.
          
          **Response**:
          - Returns the updated user information, including ID, name, email and role.
        `,
  },
  FIND_BY_ID: {
    summary: 'Find User By Id',
    description: `
          Retrieves detailed information about a user by their ID.
          
          **Access**: Only users with the ADMIN, EDITOR and VIEWER role can access this endpoint.
          
          **Parameters**:
          - The ID of the user to be fetched is provided in the URL path.
          
          **Response**:
          - Returns the user details.
        `,
  },
  FIND_ALL: {
    summary: 'Find All Users',
    description: `
          Retrieves a list of all users in the system.
          
          **Access**: Only users with the ADMIN role can access this endpoint.
          
          **Response**:
          - Returns a list of all users.
        `,
  },
  DELETE: {
    summary: 'Delete User By Id',
    description: `
          Deletes a user from the system by their ID.
          
          **Access**: Only users with the ADMIN role can access this endpoint.
          
          **Parameters**:
          - The ID of the user to be deleted is provided in the URL path.
          
          **Response**:
          - Returns a confirmation of the deletion.
        `,
  },
};

export const DOCUMENT = {
  UPLOAD: {
    summary: 'Upload Document',
    description: `
          Uploads a document to the system.
          
          **Access**: Only users with the ADMIN, EDITOR and VIEWER role can access this endpoint.
          
          **Request Body**:
          - The request body must contain the file and description fields.
          
          **Response**:
          - Returns the success message.
        `,
  },
  UPDATE: {
    summary: 'Update Document',
    description: `
          Updates the information of an existing document.
          
          **Access**: Only users with the ADMIN, EDITOR role can access this endpoint.
          
          **Parameters**:
          - The ID of the document to be updated is provided in the URL path.
          
          **Request Body**:
          - The request body must contain the updated fields defined in the UpdateDocumentDto.
          
          **Response**:
          - Returns the updated document information, including ID, name, path, size, mimeType and description.
        `,
  },
  FIND_BY_ID: {
    summary: 'Find Document By Id',
    description: `
          Retrieves detailed information about a document by its ID.
          
          **Access**: Only users with the ADMIN, EDITOR and VIEWER role can access this endpoint.
          
          **Parameters**:
          - The ID of the document to be fetched is provided in the URL path.
          
          **Response**:
          - Returns the document details.
        `,
  },
  FIND_ALL: {
    summary: 'Find All Documents',
    description: `
          Retrieves a list of all documents in the system.
          
          **Access**: Only users with the ADMIN role can access this endpoint.
          
          **Response**:
          - Returns a list of all documents.
        `,
  },
  DELETE: {
    summary: 'Delete Document By Id',
    description: `
          Deletes a document from the system by its ID.
          
          **Access**: Only users with the ADMIN role can access this endpoint.
          
          **Parameters**:
          - The ID of the document to be deleted is provided in the URL path.
          
          **Response**:
          - Returns a confirmation of the deletion.
        `,
  },
};

export const MOCK = {
  STATUS: {
    summary: 'Check Document Ingestion Status',
    description: 'Returns the ingestion status of the document',
  },
  EMBENDDING: {
    summary: 'Get Document Embedding',
    description: 'Returns the embedding of the document',
  },
};
