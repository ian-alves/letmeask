import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { NewRoom } from "./pages/NewRoom";
import { Home } from "./pages/Home";
import { AuthContextProvider } from "./contexts/AuthContext";
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';

// Switch evita o conflito de rotas qnd o path pode ser ambíguo
function App() {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <Switch>
                    <Route path="/" exact component={Home}></Route>
                    <Route path="/rooms/new" component={NewRoom}></Route>
                    <Route path="/rooms/:id" component={Room}></Route>
                    <Route path="/admin/rooms/:id" component={AdminRoom}></Route>
                </Switch>
            </AuthContextProvider>
        </BrowserRouter>
    );
}

export default App;
