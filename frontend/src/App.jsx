
import './App.css'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
function App() {

  return (
    <>
    <h1>Hello, Come Here And Waste Your Time!</h1>
    <header>
        <Show when="signed-out">
          <SignInButton mode="modal" />
          <SignUpButton mode="modal"/>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </>
  )
}

export default App
