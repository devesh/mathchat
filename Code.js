
/**
 * Responds to a message in Google Chat.
 *
 * @param {Object} event the event object from Google Workspace add-on
 */
function onMessage(event) {
  const message = event.chat.messagePayload.message;

  return {
    hostAppDataAction: {
      chatDataAction: {
        createMessageAction: {
          message: {
            text: "Click my About tab to see what commands I answer."
          }
        }
      }
    }
  };
}

/**
 * Responds to being added to a Google Chat space.
 *
 * @param {Object} event the event object from Google Workspace add-on
 */
function onAddedToSpace(event) {
  const space = event.chat.addedToSpacePayload.space;
  const user = event.chat.user;

  // If added through @mention a separate MESSAGE event is sent.
  let message = "";
  if (space.singleUserBotDm) {
    message = `Thank you for adding me to a direct message, ${user.displayName || "User"}!`;
  } else {
    message = `Thank you for adding me to ${(space.displayName || "this space")}`;
  }

  return {
    hostAppDataAction: {
      chatDataAction: {
        createMessageAction: {
          message: {
            text: message
          }
        }
      }
    }
  };
}

/**
 * Responds to being removed from a Google Chat space.
 *
 * @param {Object} event the event object from Google Workspace add-on
 */
function onRemovedFromSpace(event) {
  const space = event.chat.removedFromSpacePayload.space;
  console.info(`Chat app removed from ${(space.name || "this chat")}`);
}

// The ID of the slash command "/latex".
// You must use the same ID in the Google Chat API configuration.
const LATEX_COMMAND_ID = 1;
const SPOILER_COMMAND_ID = 2;
const CALC_COMMAND_ID = 3;

/**
 * Responds to an APP_COMMAND event in Google Chat.
 *
 * @param {Object} event the event object from Google Chat
 */
function onAppCommand(event) {
  const message = event.chat.appCommandPayload.message.text.replace(/\/[a-z]* /, "");
  const user = event.chat.user.displayName;
  // Executes the app command logic based on ID.
  switch (event.chat.appCommandPayload.appCommandMetadata.appCommandId) {
    case LATEX_COMMAND_ID:
  return {
    hostAppDataAction: {
      chatDataAction: {
        createMessageAction: {
          message: {
            cardsV2: [
      {
        card: {
          sections: [
            {
              header: message,
              widgets: [
                {
                  image: {
                    altText: message,
                    imageUrl: "https://latex.codecogs.com/png.image?\\dpi{128}" + message.replaceAll(" ", "")
                  },
                }
              ],
            }
          ],
        },
      },
    ],
          }
        }
      }
    }
  };
    case SPOILER_COMMAND_ID:
        return {
    hostAppDataAction: {
      chatDataAction: {
        createMessageAction: {
          message: {
            cardsV2: [
      {
        card: {
          sections: [
            {
              header: user + "'s Spoiler",
              collapsible: true,
              widgets: [
                {
                  textParagraph: {
                    text: message
                  },
                }
              ],
            }
          ],
        },
      },
    ],
          }
        }
      }
    }
  };
    case CALC_COMMAND_ID:
      try {
        result = Algebrite.eval(message);
      return {
        hostAppDataAction: {
          chatDataAction: {
            createMessageAction: {
              message: {
                text: result.toString(),
            cardsV2: [
      {
        card: {
          sections: [
            {
              header: result.toLatexString(),
              widgets: [
                {
                  image: {
                    altText: result.toLatexString(),
                    imageUrl: "https://latex.codecogs.com/png.image?\\dpi{128}" + result.toLatexString()
                  },
                }
              ],
            }
          ],
        },
      },
    ],
              }
            }
          }
        }
      };
      } catch (e) {
        return {
        hostAppDataAction: {
          chatDataAction: {
            createMessageAction: {
              message: {
                text: "Error: " + e.message
              }
            }
          }
      }
        }
      }
  }
}