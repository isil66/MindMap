import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/message.module.css'
import {NotesContextProvider} from '@/components/MyContext'

export default function App({ Component, pageProps }) {
  return (
    <NotesContextProvider>
      <Component {...pageProps} />
    </NotesContextProvider>

  );
}
