import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

// AWS Cognito configuration
const poolData = {
  UserPoolId: 'us-east-1_ryDGqW5QF', // skystream-users pool
  ClientId: '253ap8mkv34ktblhonapjc5bsh', // skystream-web-client
};

const userPool = new CognitoUserPool(poolData);

// Authentication service
export const cognitoAuth = {
  // Sign up new user
  signUp: (email, password, firstName) => {
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        }),
        new CognitoUserAttribute({
          Name: 'given_name',
          Value: firstName,
        }),
      ];

      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          user: result.user,
          userSub: result.userSub,
        });
      });
    });
  },

  // Sign in user
  signIn: (email, password) => {
    return new Promise((resolve, reject) => {
      const authenticationData = {
        Username: email,
        Password: password,
      };

      const authenticationDetails = new AuthenticationDetails(authenticationData);
      const userData = {
        Username: email,
        Pool: userPool,
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();

          // Get user attributes
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err);
              return;
            }

            const userAttributes = {};
            attributes.forEach((attribute) => {
              userAttributes[attribute.getName()] = attribute.getValue();
            });

            const user = {
              username: cognitoUser.getUsername(),
              email: userAttributes.email,
              displayName: userAttributes.given_name || userAttributes.name,
              photoURL: userAttributes.picture || Math.floor(Math.random() * 5) + 1,
              accessToken,
              idToken,
              refreshToken,
              attributes: userAttributes,
            };

            resolve(user);
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  },

  // Sign out user
  signOut: () => {
    return new Promise((resolve) => {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut();
      }
      localStorage.removeItem('authUser');
      resolve();
    });
  },

  // Get current user
  getCurrentUser: () => {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();

      if (!cognitoUser) {
        reject(new Error('No current user'));
        return;
      }

      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }

        if (!session.isValid()) {
          reject(new Error('Session is not valid'));
          return;
        }

        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            reject(err);
            return;
          }

          const userAttributes = {};
          attributes.forEach((attribute) => {
            userAttributes[attribute.getName()] = attribute.getValue();
          });

          const user = {
            username: cognitoUser.getUsername(),
            email: userAttributes.email,
            displayName: userAttributes.given_name || userAttributes.name,
            photoURL: userAttributes.picture || Math.floor(Math.random() * 5) + 1,
            accessToken: session.getAccessToken().getJwtToken(),
            idToken: session.getIdToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken(),
            attributes: userAttributes,
          };

          resolve(user);
        });
      });
    });
  },

  // Auth state listener
  onAuthStateChanged: (callback) => {
    // Check for current user on initialization
    cognitoAuth.getCurrentUser()
      .then((user) => {
        callback(user);
      })
      .catch(() => {
        callback(null);
      });

    // Return unsubscribe function (Cognito doesn't have built-in listeners like Firebase)
    return () => {};
  },

  // Update user profile
  updateProfile: (attributes) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();

      if (!cognitoUser) {
        reject(new Error('No current user'));
        return;
      }

      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }

        const attributeList = Object.keys(attributes).map(
          (key) =>
            new CognitoUserAttribute({
              Name: key,
              Value: attributes[key],
            })
        );

        cognitoUser.updateAttributes(attributeList, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    });
  },
};

export { userPool };
