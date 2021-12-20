export const HEADERS_OF_THE_USER_OPERATIONS_REQUEST = {
    uid: 'x-user-id',
    password: 'x-user-password',
};

export const HEADERS_OF_THE_GROUP_OPERATIONS_REQUEST = {
    gid: 'x-group-id',
};

export const EVENT_MESSAGES = {
    searchError: 'Search operation error',
    usersFound: 'Users found',
    userFound: 'User found',
    userCreationError: 'Error in the operation of creating a new user',
    userCreated: 'A new user has been created',
    updateError: 'Update operation error',
    userDataUpdated: 'User data updated',
    deleteError: 'Deletion operation error',
    userDeleted: 'User deleted',
    userNotFound: 'User not found',

    groupCreationError: 'Error in the operation of creating a new group',
    groupCreated: 'A new group has been created',
    groupDeleted: 'Group deleted',
    groupDataUpdated: 'Group data updated',

    addUsersToGroupError: 'Error adding users to a group',
    addUsersToGroup: 'Users have been successfully added to the group',
}

export const GROUP_PERMISSIONS = [
    'READ',
    'WRITE',
    'DELETE',
    'SHARE',
    'UPLOAD_FILES'
];