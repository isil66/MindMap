import RegisterForm from '../../components/RegisterForm';
import styles from '../../styles/Home.module.css';
const Home = () => {
  return (
    <div className={styles.main}>
      <h1>User Registration</h1>
      <RegisterForm />
    </div>
  );
};

export default Home;