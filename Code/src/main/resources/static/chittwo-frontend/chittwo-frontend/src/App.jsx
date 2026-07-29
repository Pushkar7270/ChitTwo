import { IdentityProvider } from "./context/IdentityContext";
import { RoomsProvider } from "./context/RoomsContext";
import { ChatSocketProvider } from "./context/ChatSocketContext";
import IdentityGate from "./components/onboarding/IdentityGate";
import AppShell from "./components/layout/AppShell";

export default function App() {
  return (
    <IdentityProvider>
      <IdentityGate>
        <RoomsProvider>
          <ChatSocketProvider>
            <AppShell />
          </ChatSocketProvider>
        </RoomsProvider>
      </IdentityGate>
    </IdentityProvider>
  );
}
