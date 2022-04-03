import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa';
import { useAppContext } from '../context/appContext';
import StatsItem from './StatsItem';
import Wrapper from '../assets/wrappers/StatsContainer';

const StatsContainer = () => {
  const { stats } = useAppContext();
  const defaultStats = [
    {
      title: 'pending applications',
      count: stats.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: '#E9B949',
      bg: '#FCEFC7',
    },
    {
      title: 'interviews scheduled',
      count: stats.interview || 0,
      icon: <FaCalendarCheck />,
      color: '#647ABC',
      bg: '#E0E8F9',
    },
    {
      title: 'jobs declined',
      count: stats.declined || 0,
      icon: <FaBug />,
      color: '#D66A6A',
      bg: '#FFEEEE',
    },
  ];

  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatsItem key={index} {...item} />;
      })}
    </Wrapper>
  );
};
export default StatsContainer;
