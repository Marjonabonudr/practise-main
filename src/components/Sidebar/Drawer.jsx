import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './sidebar';
import './Drawer.css';

const drawerVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
  exit: { x: '-100%' },
};

const Drawer = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.aside
        className="drawer"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={drawerVariants}
        transition={{ type: 'tween', duration: 0.25 }}
      >
        <button className="drawer-close" onClick={onClose}>✕</button>
        <Sidebar />
      </motion.aside>
    )}
  </AnimatePresence>
);

export default Drawer;
