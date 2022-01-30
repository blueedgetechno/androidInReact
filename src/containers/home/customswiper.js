import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Icon, Image, LazyComponent} from '../../../components/utils';
import {dispatchAction, dispatchAct} from "../../../store/actions";

const Swiper = () => {
  const [count, setCount] = useState(0);

  return <div>{count}</div>
}

export default Swiper;
