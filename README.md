# r42
r42


# General Actions
end-turn:
  require: current-player
  does: ends turn switch to another unit, removing current-player status from current player and apply this status to next player

post-message:
  require:
  does: publish message into message log

# Example area actions
goblins-attacked-village:
  require: current-player, actions-tokens(3)
  does: publish into log simple story, then allows player to choose what he do, for example:
        "Goblins attacked village"
        "What do you do?"
        "(0)Help villagers fight Goblins"
        "(1)Use situation to rob village"
        "(2)Do nothing"

        Based on the player choice different things can happen at random. For example if player selects (1):

        (30% + attack) chance: "You have successfully helped villagers they want to reward your effort, (roll drop +2)"
        (70% - attack) chance: "Unfortunately Goblins won battle, you are running away lose (roll damage 1-3)"

you-find-old-book:
  require: current-player, perceptiveness(7)
  does: publish into log simple story, then allows player to choose what he do, for example:
        "You find old book on the floor, an old man suddenly appears asking you to give him back his book."
        "What do you do?"
        "(0)Try to read the book."
        "(1)Try to sell the book to the stranger."
        "(2)Give the book to the stranger."
