
import React from 'react'
import UserTile from './UserTile'
import Filter from './Filter'
import style from './App.less'
import { makeFetchUsers, userMentionsSkill } from '../users'

const fetchUsers = makeFetchUsers(async () =>
  await (await fetch('https://ffforumautomator.herokuapp.com/hackable-data')).json()
)

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    if (!this.state.users) {
      try {
        let data = await fetchUsers()
        this.setState({ users: data })
      } catch (error) {
        this.setState({ error })
      }
    }
  }

  onFilterChange(event) {
    const text = event.target.value
    this.setState({ filter: text })
  }

  render () {
    return (
      <div className={style.app} >
        <header className={style.mainHeader}>
          <h1 className={style.pageHeading}>Connecting Functioneers Since 2am!</h1>
          <Filter onChange={this.onFilterChange.bind(this)} />
        </header>
        {
          this.state.users
          ? this.state.users
            .filter(user => !this.state.filter || userMentionsSkill(user, this.state.filter))
            .map(user =>
              <UserTile user={user} key={user.username} />
            )
          : this.state.error
          ? "Error! O.o"
          : "Loading..."
        }
      </div>
    )
  }
}
