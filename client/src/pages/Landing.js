import { Link } from 'react-router-dom';
import { Logo } from '../components';
import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            Job <span>Tracking</span> App
          </h1>
          <p>
            Dreamcatcher schlitz next level, bicycle rights mustache humblebrag
            salvia. Mlkshk pok pok meh man braid before they sold out raclette
            green juice pabst skateboard franzen meggings. Ugh beard franzen
            meditation before they sold out typewriter, pinterest migas venmo.
            Forage occupy food truck, vegan retro shoreditch pinterest.
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        <img className="img main-img" src={main} alt="Job Hunt" />
      </div>
    </Wrapper>
  );
};

export default Landing;
