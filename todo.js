//////////////////////////////////////////////////////////////////////////////////
//                                   TODO
//                                ----------
//   RECEIVE MULTIPLE CARDS TO PLAY [X]
//   DEFINE PICK UP STACK [X]
//   DEFINE PLAY VALID CARD [X]
//   DEFINE PLAY BEST CARD [X]
//   (Reduce array of available cards to valid cards and choose the lowest possible card to play)
//   DEFINE WINNER & LOSER [X]
//   SELECT BEST CARDS FOR FACE UP FROM OPEN [X]
// BUG [ 4 OF A KIND 5s SWITCHES THE PLAYER] [X]
// BUG [ CANT PLAY POWER CARD ON AN 8] [X]
// TODO [PLAY FACE DOWN RANDOMLY EVEN IF NOT LEGAL] [X]
// TODO [PICK UP LAST FACE UP WITH STACK] [X]
// TODO [HAVE PICK VALID CARD ONLY PLAY SINGLE POWER CARDS AT A TIME] [X]

//   PLAY 4 OF A KIND AT ANY TIME (LIKE A TEN)  [X]
//   DEALER DETERMINES PLAYER WITH LOWEST STARTING HAND [ ]
//   DISALLOW FINISHING ON A POWER CARD OR 4OAK OR SKIP-BACK-PENULTIMATE CARD [ ]

//   RECEIVE MULTIPLE PLAYERS [ ]
//   ALLOW MULTIDIRECTIONAL PLAY [ ]
//   DEFINE WILDCARD (JOKER) [ ]

//   TIDY UP PLAY CARD (HAND / FACE UP / FACE DOWN) [ ]
//   ABSTRACT SIMPLE REPETITIVE FUNCTIONS OUT OF CLASSES [ ]
//   TIDY UP CARD GENERATION [ ]
//   REDEFINE POWER CARD RULES [ ]
//   ALLOW RULES OBJECT PARAMETER [ ]

// ADD 'ACE OF NEIL DIAMONDS' [ ]

//
//
//////////////////////////////////////////////////////////////////////////////////

///////////////// CHECK FOR 4 OF A KIND //////////////
// SORT HAND CARDS
// ITERATE THROUGH IN STEPS OF FOUR, CHECKING FOR 4OAK
// SAVE 4 CARDS
// PLAY FOUR CARDS
