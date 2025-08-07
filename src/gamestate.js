export class GameState {
  constructor() {
    this.currentPlayer = 1
    this.players = {
      1: { group: null, name: 'Player 1' },
      2: { group: null, name: 'Player 2' }
    }
    this.gamePhase = 'breaking'
    this.winner = null
    this.foul = false
    this.shotValid = false
    this.ballsPocketed = []
    this.eightBallPocketed = false
    this.cueBallPocketed = false
    this.firstBallHit = null
  }

  reset() {
    this.currentPlayer = 1
    this.players[1].group = null
    this.players[2].group = null
    this.gamePhase = 'breaking'
    this.winner = null
    this.foul = false
    this.shotValid = false
    this.ballsPocketed = []
    this.eightBallPocketed = false
    this.cueBallPocketed = false
    this.firstBallHit = null
  }

  assignGroups(balls) {
    if (this.gamePhase !== 'breaking' || this.ballsPocketed.length === 0) return

    const pocketedBalls = this.ballsPocketed.filter(b => b.userData.number > 0 && b.userData.number < 8)
    if (pocketedBalls.length === 0) return

    const solids = pocketedBalls.filter(b => b.userData.isSolid)
    const stripes = pocketedBalls.filter(b => b.userData.isStripe)

    if (solids.length > stripes.length) {
      this.players[this.currentPlayer].group = 'solids'
      this.players[this.getOtherPlayer()].group = 'stripes'
    } else if (stripes.length > solids.length) {
      this.players[this.currentPlayer].group = 'stripes'
      this.players[this.getOtherPlayer()].group = 'solids'
    }

    if (this.players[this.currentPlayer].group) {
      this.gamePhase = 'playing'
    }
  }

  getOtherPlayer() {
    return this.currentPlayer === 1 ? 2 : 1
  }

  checkLegalShot() {
    this.shotValid = false
    this.foul = false

    if (this.cueBallPocketed) {
      this.foul = true
      return
    }

    if (this.eightBallPocketed) {
      if (this.gamePhase === 'playing') {
        const playerGroup = this.players[this.currentPlayer].group
        const playerBallsRemaining = this.countPlayerBalls(playerGroup)
        
        if (playerBallsRemaining === 0) {
          this.winner = this.currentPlayer
        } else {
          this.winner = this.getOtherPlayer()
          this.foul = true
        }
      }
      return
    }

    if (!this.firstBallHit) {
      this.foul = true
      return
    }

    if (this.gamePhase === 'playing') {
      const playerGroup = this.players[this.currentPlayer].group
      const correctTarget = this.getCorrectTarget(playerGroup)
      
      if (this.firstBallHit.userData.number !== correctTarget) {
        this.foul = true
        return
      }
    }

    this.shotValid = true
  }

  getCorrectTarget(playerGroup) {
    if (!playerGroup) return null
    
    const playerBallsRemaining = this.countPlayerBalls(playerGroup)
    if (playerBallsRemaining === 0) return 8
    
    if (playerGroup === 'solids') {
      for (let i = 1; i <= 7; i++) {
        const ball = this.findBallByNumber(i)
        if (ball && !ball.userData.inPocket) return i
      }
    } else {
      for (let i = 9; i <= 15; i++) {
        const ball = this.findBallByNumber(i)
        if (ball && !ball.userData.inPocket) return i
      }
    }
    return 8
  }

  countPlayerBalls(playerGroup) {
    if (!playerGroup) return 7
    
    let count = 0
    const range = playerGroup === 'solids' ? [1, 7] : [9, 15]
    
    for (let i = range[0]; i <= range[1]; i++) {
      const ball = this.findBallByNumber(i)
      if (ball && !ball.userData.inPocket) count++
    }
    return count
  }

  findBallByNumber(number) {
    return window.gameBalls?.find(b => b.userData.number === number)
  }

  endTurn() {
    if (!this.foul && this.ballsPocketed.length > 0 && !this.eightBallPocketed) {
      return
    }
    
    this.currentPlayer = this.getOtherPlayer()
  }

  startShot() {
    this.ballsPocketed = []
    this.eightBallPocketed = false
    this.cueBallPocketed = false
    this.firstBallHit = null
  }

  getStatusMessage() {
    if (this.winner) {
      return `${this.players[this.winner].name} wins!`
    }

    if (this.gamePhase === 'breaking') {
      return `${this.players[this.currentPlayer].name} - Breaking`
    }

    const playerGroup = this.players[this.currentPlayer].group
    const groupText = playerGroup ? ` (${playerGroup})` : ''
    const remaining = playerGroup ? this.countPlayerBalls(playerGroup) : ''
    const remainingText = remaining !== '' ? ` - ${remaining} left` : ''

    return `${this.players[this.currentPlayer].name}${groupText}${remainingText}`
  }
}

export const gameState = new GameState()