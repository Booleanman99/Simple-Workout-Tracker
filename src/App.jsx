import React, { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'yea-buddy-tracker-data';

const CATEGORY_ABBREV = {
  'Back': 'Ba',
  'Bicep': 'Bi',
  'Chest': 'C',
  'Legs': 'L',
  'Shoulder': 'S',
  'Tricep': 'T'
};

const EXERCISES = {
  'Chest': [
    'Incline Dumbbell Press',
    'Incline Barbell Press',
    'Flat Dumbbell Press',
    'Flat Barbell Press',
    'Decline Dumbbell Press',
    'Decline Barbell Press',
    'Seated Chest Press',
    'Chest Pec Flies'
  ],
  'Shoulder': [
    'Dumbbell Shoulder Raises',
    'Barbell Shoulder Raises',
    'Seated Machine Shoulder Press',
    'Arnold Press',
    'Lateral Raises Dumbbell',
    'Lateral Raises Cable'
  ],
  'Tricep': [
    'Tricep Overhead Raises',
    'Tricep Cable Pushdown Rod',
    'Tricep Cable Pushdown Rope',
    'Overhead Tricep Extensions Cable',
    'Tricep Skullcrushers Bar',
    'Seated Tricep Pushdown'
  ],
  'Back': [
    'Lat Pulldown C-Bar',
    'Lat Pulldown Close Grip',
    'Cable Back Rows',
    'Machine Back Rows',
    'Reverse Grip Lat Pulldown',
    'Rear Delt Flies',
    'Deadlifts',
    'Rear Delt Shrugs',
    'Barbell Back Rows',
    'Dumbbell Back Rows'
  ],
  'Bicep': [
    'Cable Bicep Curls Bar',
    'Cable Bicep Curls Rope',
    'Cable Bicep Curls Single',
    'Dumbbell Bicep Curls',
    'Dumbbell Hammer Curls',
    'Seated Dumbbell Curls',
    'Seated Bicep Machine',
    'Preacher Curls'
  ],
  'Legs': [
    'Hamstring Curls',
    'Squats',
    'Bulgarian Split Squat',
    'Leg Extensions',
    'Calf Raises Standing',
    'Calf Raises Seated'
  ]
};

function ExerciseDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const filteredExercises = {};
  const searchLower = search.toLowerCase();
  
  Object.entries(EXERCISES).forEach(([category, exercises]) => {
    const filtered = exercises.filter(ex => 
      ex.toLowerCase().includes(searchLower) || 
      category.toLowerCase().includes(searchLower)
    );
    if (filtered.length > 0) {
      filteredExercises[category] = filtered;
    }
  });

  const handleSelect = (exercise) => {
    onChange(exercise);
    setSearch('');
    setIsOpen(false);
  };

  const hasResults = Object.keys(filteredExercises).length > 0;

  return (
    <div ref={dropdownRef} style={dropdownStyles.container}>
      <div 
        style={dropdownStyles.inputWrapper}
        onClick={() => setIsOpen(true)}
      >
        <input
          style={dropdownStyles.input}
          placeholder="Search or select exercise..."
          value={isOpen ? search : value}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <span style={dropdownStyles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div style={dropdownStyles.dropdown}>
          {hasResults ? (
            Object.entries(filteredExercises).map(([category, exercises]) => (
              <div key={category}>
                <div style={dropdownStyles.categoryHeader}>{category}</div>
                {exercises.map(exercise => (
                  <div
                    key={exercise}
                    style={dropdownStyles.option}
                    className="dropdown-option"
                    onClick={() => handleSelect(exercise)}
                  >
                    {exercise}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div style={dropdownStyles.noResults}>No exercises found</div>
          )}
        </div>
      )}
    </div>
  );
}

const dropdownStyles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '16px',
    paddingRight: '40px',
    fontSize: '16px',
    border: '2px solid #eee',
    borderRadius: '12px',
    background: '#fff',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
  },
  arrow: {
    position: 'absolute',
    right: '16px',
    fontSize: '12px',
    color: '#888',
    pointerEvents: 'none',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '8px',
    background: '#fff',
    borderRadius: '12px',
    border: '2px solid #eee',
    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
    maxHeight: '300px',
    overflowY: 'auto',
    zIndex: 1000,
  },
  categoryHeader: {
    padding: '12px 16px 8px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: '#1a1a1a',
    background: '#f9f9f9',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
  },
  option: {
    padding: '14px 16px',
    fontSize: '15px',
    color: '#333',
    cursor: 'pointer',
    borderBottom: '1px solid #f5f5f5',
    transition: 'background 0.15s ease',
  },
  noResults: {
    padding: '20px 16px',
    fontSize: '14px',
    color: '#888',
    textAlign: 'center',
  },
};

function getExerciseCategory(exerciseName) {
  for (const [category, exercises] of Object.entries(EXERCISES)) {
    if (exercises.includes(exerciseName)) {
      return category;
    }
  }
  return null;
}

function getWorkoutCategories(exercises) {
  const categories = new Set();
  exercises.forEach(ex => {
    const cat = getExerciseCategory(ex.name);
    if (cat) categories.add(cat);
  });
  // Sort alphabetically and return abbreviations
  return Array.from(categories)
    .sort()
    .map(cat => CATEGORY_ABBREV[cat])
    .join(', ');
}

export default function FitnessTracker() {
  const [currentView, setCurrentView] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const fileInputRef = useRef(null);
  
  // Workout form
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [todayExercises, setTodayExercises] = useState([]);
  
  // Meal form
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [todayMeals, setTodayMeals] = useState([]);

  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const dateDisplay = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setWorkouts(data.workouts || []);
        setMeals(data.meals || []);
      }
    } catch (e) {
      console.log('Starting fresh');
    }
    setLoading(false);
  };

  const saveData = (newWorkouts, newMeals) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ workouts: newWorkouts, meals: newMeals }));
    } catch (e) {
      console.error('Save failed:', e);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  };

  const navigateTo = (view) => {
    if (view === currentView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 300);
  };

  const addExercise = () => {
    if (!exerciseName || !sets || !reps) return;
    setTodayExercises([...todayExercises, {
      id: Date.now(),
      name: exerciseName,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: weight ? parseFloat(weight) : 0,
      unit: weightUnit,
      time: timeString
    }]);
    setExerciseName(''); setSets(''); setReps(''); setWeight('');
  };

  const saveWorkout = () => {
    if (todayExercises.length === 0) return;
    const existingIndex = workouts.findIndex(w => w.date === today);
    let newWorkouts;
    if (existingIndex >= 0) {
      newWorkouts = [...workouts];
      newWorkouts[existingIndex].exercises = [...newWorkouts[existingIndex].exercises, ...todayExercises];
    } else {
      newWorkouts = [{ id: Date.now(), date: today, dateDisplay, exercises: todayExercises }, ...workouts];
    }
    setWorkouts(newWorkouts);
    saveData(newWorkouts, meals);
    setTodayExercises([]);
    showNotification('Workout saved');
  };

  const addMealItem = () => {
    if (!foodName || !calories) return;
    setTodayMeals([...todayMeals, {
      id: Date.now(),
      name: foodName,
      calories: parseInt(calories),
      protein: protein ? parseFloat(protein) : 0,
      carbs: carbs ? parseFloat(carbs) : 0,
      fats: fats ? parseFloat(fats) : 0,
      time: timeString
    }]);
    setFoodName(''); setCalories(''); setProtein(''); setCarbs(''); setFats('');
  };

  const saveMeals = () => {
    if (todayMeals.length === 0) return;
    const existingIndex = meals.findIndex(m => m.date === today);
    let newMeals;
    if (existingIndex >= 0) {
      newMeals = [...meals];
      newMeals[existingIndex].items = [...newMeals[existingIndex].items, ...todayMeals];
    } else {
      newMeals = [{ id: Date.now(), date: today, dateDisplay, items: todayMeals }, ...meals];
    }
    setMeals(newMeals);
    saveData(workouts, newMeals);
    setTodayMeals([]);
    showNotification('Meals logged');
  };

  const deleteWorkout = (id) => {
    if (!window.confirm('Delete this workout?')) return;
    const newWorkouts = workouts.filter(w => w.id !== id);
    setWorkouts(newWorkouts);
    saveData(newWorkouts, meals);
    showNotification('Workout deleted');
  };

  const deleteMealDay = (id) => {
    if (!window.confirm('Delete this meal log?')) return;
    const newMeals = meals.filter(m => m.id !== id);
    setMeals(newMeals);
    saveData(workouts, newMeals);
    showNotification('Meal log deleted');
  };

  const exportData = () => {
    const data = {
      appName: 'YEA BUDDY Tracker',
      exportDate: new Date().toISOString(),
      workouts,
      meals
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yea-buddy-backup-${today}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Backup exported!');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.workouts && data.meals) {
          // Merge or replace - here we replace
          setWorkouts(data.workouts);
          setMeals(data.meals);
          saveData(data.workouts, data.meals);
          showNotification('Backup restored!');
        } else {
          showNotification('Invalid backup file');
        }
      } catch (err) {
        showNotification('Error reading file');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const clearAllData = () => {
    const firstConfirm = window.confirm('⚠️ ARE YOU SURE?\n\nThis will delete ALL your workout and nutrition data.');
    if (!firstConfirm) return;
    
    const secondConfirm = window.confirm('⚠️ ARE YOU REALLY SURE?\n\nThis action CANNOT be undone. All your gains history will be lost forever.\n\nClick OK only if you are 100% certain.');
    if (!secondConfirm) return;
    
    setWorkouts([]);
    setMeals([]);
    saveData([], []);
    showNotification('All data cleared');
  };

  const getTodayTotals = () => {
    const todayMealEntry = meals.find(m => m.date === today);
    const items = todayMealEntry?.items || [];
    return {
      calories: items.reduce((s, m) => s + m.calories, 0),
      protein: items.reduce((s, m) => s + m.protein, 0),
      carbs: items.reduce((s, m) => s + m.carbs, 0),
      fats: items.reduce((s, m) => s + m.fats, 0)
    };
  };

  const totals = getTodayTotals();
  const todayWorkout = workouts.find(w => w.date === today);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingDot} />
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@400;500;600&display=swap');
        
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        
        html, body { 
          margin: 0; 
          padding: 0; 
          overscroll-behavior: none;
          -webkit-overflow-scrolling: touch;
        }
        
        input, button { font-family: 'DM Sans', sans-serif; }
        
        input:focus { outline: none; border-color: #1a1a1a !important; }
        
        button:active { transform: scale(0.98); }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes notificationIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
        
        .nav-item:hover { background: #f5f5f5; }
        
        .delete-btn:hover { background: #fee2e2; color: #dc2626; }
        
        .dropdown-option:hover { background: #f5f5f5; }
        
        .calendar-day:hover { opacity: 0.8; }
        
        input::placeholder { color: #a0a0a0; }
        
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>

      {/* Notification Toast */}
      {notification && (
        <div style={styles.notification}>{notification}</div>
      )}

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>YEA BUDDY</h1>
          <span style={styles.time}>{timeString}</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        ...styles.main,
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'translateY(12px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}>
        
        {/* HOME VIEW */}
        {currentView === 'home' && (
          <div style={styles.viewContainer}>
            <div style={styles.dateCard}>
              <span style={styles.dateLabel}>Today</span>
              <h2 style={styles.dateHeading}>{dateDisplay}</h2>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard} onClick={() => navigateTo('workout')}>
                <span style={styles.statLabel}>Exercises</span>
                <span style={styles.statValue}>{todayWorkout?.exercises.length || 0}</span>
              </div>
              <div style={styles.statCard} onClick={() => navigateTo('nutrition')}>
                <span style={styles.statLabel}>Calories</span>
                <span style={styles.statValue}>{totals.calories}</span>
              </div>
            </div>

            <div style={styles.macroBar}>
              <div style={styles.macroItem}>
                <span style={styles.macroValue}>{totals.protein}g</span>
                <span style={styles.macroLabel}>Protein</span>
              </div>
              <div style={styles.macroDivider} />
              <div style={styles.macroItem}>
                <span style={styles.macroValue}>{totals.carbs}g</span>
                <span style={styles.macroLabel}>Carbs</span>
              </div>
              <div style={styles.macroDivider} />
              <div style={styles.macroItem}>
                <span style={styles.macroValue}>{totals.fats}g</span>
                <span style={styles.macroLabel}>Fats</span>
              </div>
            </div>

            <div style={styles.quickActions}>
              <button style={styles.primaryBtn} onClick={() => navigateTo('workout')}>
                Log Workout
              </button>
              <button style={styles.secondaryBtn} onClick={() => navigateTo('nutrition')}>
                Log Food
              </button>
            </div>

            {/* Recent Activity */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Recent Activity</h3>
              {workouts.length === 0 && meals.length === 0 ? (
                <p style={styles.emptyText}>No activity yet. Start logging!</p>
              ) : (
                <div style={styles.activityList}>
                  {workouts.slice(0, 3).map((w, i) => (
                    <div key={w.id} style={{...styles.activityCard, animationDelay: `${i * 0.1}s`}} className="card">
                      <div style={styles.activityIcon}>💪</div>
                      <div style={styles.activityInfo}>
                        <span style={styles.activityTitle}>{w.exercises.length} exercises</span>
                        <span style={styles.activityDate}>{w.dateDisplay}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* WORKOUT VIEW */}
        {currentView === 'workout' && (
          <div style={styles.viewContainer}>
            <button style={styles.backBtn} onClick={() => navigateTo('home')}>
              ← Back
            </button>
            
            <h2 style={styles.viewTitle}>Log Workout</h2>
            <p style={styles.viewSubtitle}>{dateDisplay}</p>

            <div style={styles.form}>
              <ExerciseDropdown 
                value={exerciseName}
                onChange={setExerciseName}
              />
              <div style={styles.inputRow}>
                <input
                  style={{...styles.input, ...styles.inputSmall}}
                  placeholder="Sets"
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                />
                <input
                  style={{...styles.input, ...styles.inputSmall}}
                  placeholder="Reps"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                />
              </div>
              <div style={styles.inputRow}>
                <input
                  style={{...styles.input, flex: 1}}
                  placeholder="Weight (optional)"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <select 
                  style={styles.select}
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
              <button style={styles.addBtn} onClick={addExercise}>
                + Add Exercise
              </button>
            </div>

            {todayExercises.length > 0 && (
              <div style={styles.pendingSection}>
                <h4 style={styles.pendingTitle}>This Session</h4>
                {todayExercises.map((ex, i) => (
                  <div key={ex.id} style={styles.exerciseCard}>
                    <div style={styles.exerciseInfo}>
                      <span style={styles.exerciseName}>{ex.name}</span>
                      <span style={styles.exerciseDetails}>
                        {ex.sets} × {ex.reps} {ex.weight > 0 && `@ ${ex.weight} ${ex.unit}`}
                      </span>
                    </div>
                    <button 
                      style={styles.removeBtn}
                      onClick={() => setTodayExercises(todayExercises.filter(e => e.id !== ex.id))}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button style={styles.saveBtn} onClick={saveWorkout}>
                  Save Workout
                </button>
              </div>
            )}

            {/* History */}
            <div style={styles.historySection}>
              <h3 style={styles.sectionTitle}>Workout History</h3>
              {workouts.length === 0 ? (
                <p style={styles.emptyText}>No workouts logged yet</p>
              ) : (
                workouts.map((w, i) => (
                  <div key={w.id} style={styles.historyCard} className="card">
                    <div style={styles.historyHeader}>
                      <span style={styles.historyDate}>{w.dateDisplay}</span>
                      <button 
                        style={styles.deleteBtn} 
                        className="delete-btn"
                        onClick={() => deleteWorkout(w.id)}
                      >
                        Delete
                      </button>
                    </div>
                    {w.exercises.map(ex => (
                      <div key={ex.id} style={styles.historyExercise}>
                        <span style={styles.historyExName}>{ex.name}</span>
                        <span style={styles.historyExDetails}>
                          {ex.sets}×{ex.reps} {ex.weight > 0 && `@ ${ex.weight}${ex.unit}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* NUTRITION VIEW */}
        {currentView === 'nutrition' && (
          <div style={styles.viewContainer}>
            <button style={styles.backBtn} onClick={() => navigateTo('home')}>
              ← Back
            </button>
            
            <h2 style={styles.viewTitle}>Log Nutrition</h2>
            <p style={styles.viewSubtitle}>{dateDisplay}</p>

            <div style={styles.todayMacros}>
              <div style={styles.macroCircle}>
                <span style={styles.macroCircleValue}>{totals.calories}</span>
                <span style={styles.macroCircleLabel}>kcal</span>
              </div>
              <div style={styles.macroDetails}>
                <div style={styles.macroDetailRow}>
                  <span style={styles.macroDetailLabel}>Protein</span>
                  <span style={styles.macroDetailValue}>{totals.protein}g</span>
                </div>
                <div style={styles.macroDetailRow}>
                  <span style={styles.macroDetailLabel}>Carbs</span>
                  <span style={styles.macroDetailValue}>{totals.carbs}g</span>
                </div>
                <div style={styles.macroDetailRow}>
                  <span style={styles.macroDetailLabel}>Fats</span>
                  <span style={styles.macroDetailValue}>{totals.fats}g</span>
                </div>
              </div>
            </div>

            <div style={styles.form}>
              <input
                style={styles.input}
                placeholder="Food name"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
              <input
                style={styles.input}
                placeholder="Calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
              <div style={styles.inputRow}>
                <input
                  style={{...styles.input, ...styles.inputSmall}}
                  placeholder="Protein (g)"
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
                <input
                  style={{...styles.input, ...styles.inputSmall}}
                  placeholder="Carbs (g)"
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
                <input
                  style={{...styles.input, ...styles.inputSmall}}
                  placeholder="Fats (g)"
                  type="number"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                />
              </div>
              <button style={styles.addBtn} onClick={addMealItem}>
                + Add Food
              </button>
            </div>

            {todayMeals.length > 0 && (
              <div style={styles.pendingSection}>
                <h4 style={styles.pendingTitle}>Adding Now</h4>
                {todayMeals.map((meal) => (
                  <div key={meal.id} style={styles.mealCard}>
                    <div style={styles.mealInfo}>
                      <span style={styles.mealName}>{meal.name}</span>
                      <span style={styles.mealMacros}>
                        {meal.calories} kcal · P:{meal.protein}g · C:{meal.carbs}g · F:{meal.fats}g
                      </span>
                    </div>
                    <button 
                      style={styles.removeBtn}
                      onClick={() => setTodayMeals(todayMeals.filter(m => m.id !== meal.id))}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button style={styles.saveBtn} onClick={saveMeals}>
                  Save Meals
                </button>
              </div>
            )}

            {/* History */}
            <div style={styles.historySection}>
              <h3 style={styles.sectionTitle}>Nutrition History</h3>
              {meals.length === 0 ? (
                <p style={styles.emptyText}>No meals logged yet</p>
              ) : (
                meals.map((day) => {
                  const dayTotals = {
                    cal: day.items.reduce((s, m) => s + m.calories, 0),
                    p: day.items.reduce((s, m) => s + m.protein, 0),
                    c: day.items.reduce((s, m) => s + m.carbs, 0),
                    f: day.items.reduce((s, m) => s + m.fats, 0)
                  };
                  return (
                    <div key={day.id} style={styles.historyCard} className="card">
                      <div style={styles.historyHeader}>
                        <span style={styles.historyDate}>{day.dateDisplay}</span>
                        <button 
                          style={styles.deleteBtn}
                          className="delete-btn"
                          onClick={() => deleteMealDay(day.id)}
                        >
                          Delete
                        </button>
                      </div>
                      <div style={styles.dayTotals}>
                        {dayTotals.cal} kcal · P:{dayTotals.p}g · C:{dayTotals.c}g · F:{dayTotals.f}g
                      </div>
                      {day.items.map(item => (
                        <div key={item.id} style={styles.historyMeal}>
                          <span style={styles.historyMealName}>{item.name}</span>
                          <span style={styles.historyMealCal}>{item.calories} kcal</span>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* CALENDAR VIEW */}
        {currentView === 'calendar' && (
          <div style={styles.viewContainer}>
            <h2 style={styles.viewTitle}>Workout Calendar</h2>
            <p style={styles.viewSubtitle}>Track your consistency</p>

            {/* Calendar Navigation */}
            <div style={calendarStyles.navigation}>
              <button 
                style={calendarStyles.navBtn}
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
              >
                ←
              </button>
              <span style={calendarStyles.monthLabel}>
                {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button 
                style={calendarStyles.navBtn}
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
              >
                →
              </button>
            </div>

            {/* Calendar Grid */}
            <div style={calendarStyles.calendar}>
              {/* Day Headers */}
              <div style={calendarStyles.dayHeaders}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} style={calendarStyles.dayHeader}>{day}</div>
                ))}
              </div>

              {/* Calendar Days */}
              <div style={calendarStyles.daysGrid}>
                {(() => {
                  const year = calendarMonth.getFullYear();
                  const month = calendarMonth.getMonth();
                  const firstDay = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const days = [];

                  // Empty cells for days before month starts
                  for (let i = 0; i < firstDay; i++) {
                    days.push(<div key={`empty-${i}`} style={calendarStyles.emptyDay} />);
                  }

                  // Actual days
                  for (let day = 1; day <= daysInMonth; day++) {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const workout = workouts.find(w => w.date === dateStr);
                    const isToday = dateStr === today;
                    const hasWorkout = !!workout;
                    const categories = workout ? getWorkoutCategories(workout.exercises) : '';

                    days.push(
                      <div
                        key={day}
                        style={{
                          ...calendarStyles.day,
                          ...(isToday ? calendarStyles.today : {}),
                          ...(hasWorkout ? calendarStyles.hasWorkout : {}),
                        }}
                        className="calendar-day"
                        onClick={() => workout && setSelectedDate(workout)}
                      >
                        <span style={calendarStyles.dayNumber}>{day}</span>
                        {categories && (
                          <span style={calendarStyles.categories}>{categories}</span>
                        )}
                      </div>
                    );
                  }

                  return days;
                })()}
              </div>
            </div>

            {/* Legend */}
            <div style={calendarStyles.legend}>
              <h4 style={calendarStyles.legendTitle}>Legend</h4>
              <div style={calendarStyles.legendGrid}>
                {Object.entries(CATEGORY_ABBREV).map(([cat, abbrev]) => (
                  <div key={cat} style={calendarStyles.legendItem}>
                    <span style={calendarStyles.legendAbbrev}>{abbrev}</span>
                    <span style={calendarStyles.legendCat}>{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Date Modal */}
            {selectedDate && (
              <div style={calendarStyles.modalOverlay} onClick={() => setSelectedDate(null)}>
                <div style={calendarStyles.modal} onClick={(e) => e.stopPropagation()}>
                  <div style={calendarStyles.modalHeader}>
                    <h3 style={calendarStyles.modalTitle}>{selectedDate.dateDisplay}</h3>
                    <button style={calendarStyles.modalClose} onClick={() => setSelectedDate(null)}>×</button>
                  </div>
                  <div style={calendarStyles.modalCategories}>
                    {getWorkoutCategories(selectedDate.exercises)}
                  </div>
                  <div style={calendarStyles.modalExercises}>
                    {selectedDate.exercises.map(ex => (
                      <div key={ex.id} style={calendarStyles.modalExercise}>
                        <span style={calendarStyles.modalExName}>{ex.name}</span>
                        <span style={calendarStyles.modalExDetails}>
                          {ex.sets}×{ex.reps} {ex.weight > 0 && `@ ${ex.weight}${ex.unit}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS VIEW */}
        {currentView === 'settings' && (
          <div style={styles.viewContainer}>
            <h2 style={styles.viewTitle}>Settings</h2>
            <p style={styles.viewSubtitle}>Backup & manage your data</p>

            {/* Stats Summary */}
            <div style={settingsStyles.statsCard}>
              <h4 style={settingsStyles.statsTitle}>Your Progress</h4>
              <div style={settingsStyles.statsGrid}>
                <div style={settingsStyles.statItem}>
                  <span style={settingsStyles.statNumber}>{workouts.length}</span>
                  <span style={settingsStyles.statLabel}>Workouts</span>
                </div>
                <div style={settingsStyles.statItem}>
                  <span style={settingsStyles.statNumber}>{workouts.reduce((sum, w) => sum + w.exercises.length, 0)}</span>
                  <span style={settingsStyles.statLabel}>Exercises</span>
                </div>
                <div style={settingsStyles.statItem}>
                  <span style={settingsStyles.statNumber}>{meals.length}</span>
                  <span style={settingsStyles.statLabel}>Meal Days</span>
                </div>
              </div>
            </div>

            {/* Export/Import Section */}
            <div style={settingsStyles.section}>
              <h4 style={settingsStyles.sectionTitle}>Backup Data</h4>
              <p style={settingsStyles.sectionDesc}>
                Export your data to save a backup file to your device. You can import it later to restore your progress.
              </p>
              <button style={settingsStyles.exportBtn} onClick={exportData}>
                <span style={settingsStyles.btnIcon}>↓</span>
                Export Backup
              </button>
            </div>

            <div style={settingsStyles.section}>
              <h4 style={settingsStyles.sectionTitle}>Restore Data</h4>
              <p style={settingsStyles.sectionDesc}>
                Import a previously exported backup file. This will replace your current data.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <button style={settingsStyles.importBtn} onClick={() => fileInputRef.current?.click()}>
                <span style={settingsStyles.btnIcon}>↑</span>
                Import Backup
              </button>
            </div>

            {/* Danger Zone */}
            <div style={settingsStyles.dangerSection}>
              <h4 style={settingsStyles.dangerTitle}>Danger Zone</h4>
              <p style={settingsStyles.sectionDesc}>
                Permanently delete all your workout and nutrition data. This cannot be undone.
              </p>
              <button style={settingsStyles.dangerBtn} onClick={clearAllData}>
                Delete All Data
              </button>
            </div>

            {/* App Info */}
            <div style={settingsStyles.appInfo}>
              <span style={settingsStyles.appName}>YEA BUDDY</span>
              <span style={settingsStyles.appVersion}>v1.0 • LIGHTWEIGHT BABY!</span>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav style={styles.bottomNav}>
        <button 
          style={{...styles.navItem, ...(currentView === 'home' ? styles.navItemActive : {})}}
          className="nav-item"
          onClick={() => navigateTo('home')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <span style={styles.navLabel}>Home</span>
        </button>
        <button 
          style={{...styles.navItem, ...(currentView === 'workout' ? styles.navItemActive : {})}}
          className="nav-item"
          onClick={() => navigateTo('workout')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6.5 6.5h11M6.5 17.5h11M4 12h2M18 12h2M7 12h10"/>
            <circle cx="4" cy="12" r="2"/>
            <circle cx="20" cy="12" r="2"/>
          </svg>
          <span style={styles.navLabel}>Workout</span>
        </button>
        <button 
          style={{...styles.navItem, ...(currentView === 'nutrition' ? styles.navItemActive : {})}}
          className="nav-item"
          onClick={() => navigateTo('nutrition')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
            <line x1="6" y1="1" x2="6" y2="4"/>
            <line x1="10" y1="1" x2="10" y2="4"/>
            <line x1="14" y1="1" x2="14" y2="4"/>
          </svg>
          <span style={styles.navLabel}>Nutrition</span>
        </button>
        <button 
          style={{...styles.navItem, ...(currentView === 'calendar' ? styles.navItemActive : {})}}
          className="nav-item"
          onClick={() => navigateTo('calendar')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span style={styles.navLabel}>Calendar</span>
        </button>
        <button 
          style={{...styles.navItem, ...(currentView === 'settings' ? styles.navItemActive : {})}}
          className="nav-item"
          onClick={() => navigateTo('settings')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
          <span style={styles.navLabel}>Settings</span>
        </button>
      </nav>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    background: '#fafafa',
    minHeight: '100vh',
    maxWidth: '100vw',
    overflow: 'hidden',
    position: 'relative',
    paddingBottom: '80px',
    WebkitFontSmoothing: 'antialiased',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#fafafa',
  },
  loadingDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#1a1a1a',
    animation: 'pulse 1.2s ease-in-out infinite',
  },
  notification: {
    position: 'fixed',
    top: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1a1a1a',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 1000,
    animation: 'notificationIn 0.3s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  header: {
    position: 'sticky',
    top: 0,
    background: 'rgba(250,250,250,0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid #eee',
    zIndex: 100,
    padding: '16px 20px',
    paddingTop: 'max(16px, env(safe-area-inset-top))',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    fontWeight: '600',
    letterSpacing: '2px',
    margin: 0,
    color: '#1a1a1a',
  },
  time: {
    fontSize: '13px',
    color: '#888',
    fontWeight: '500',
  },
  main: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
  },
  viewContainer: {
    animation: 'fadeIn 0.4s ease',
  },
  dateCard: {
    marginBottom: '24px',
  },
  dateLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: '#888',
    fontWeight: '600',
  },
  dateHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: '500',
    margin: '8px 0 0 0',
    color: '#1a1a1a',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '16px',
  },
  statCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid #eee',
  },
  statLabel: {
    display: 'block',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#888',
    fontWeight: '600',
    marginBottom: '8px',
  },
  statValue: {
    display: 'block',
    fontFamily: "'Playfair Display', serif",
    fontSize: '36px',
    fontWeight: '500',
    color: '#1a1a1a',
  },
  macroBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '24px',
    border: '1px solid #eee',
  },
  macroItem: {
    textAlign: 'center',
  },
  macroValue: {
    display: 'block',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  macroLabel: {
    display: 'block',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#888',
    marginTop: '4px',
  },
  macroDivider: {
    width: '1px',
    height: '30px',
    background: '#eee',
  },
  quickActions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
  },
  primaryBtn: {
    flex: 1,
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  },
  secondaryBtn: {
    flex: 1,
    background: '#fff',
    color: '#1a1a1a',
    border: '2px solid #1a1a1a',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  },
  section: {
    marginTop: '8px',
  },
  sectionTitle: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: '#888',
    fontWeight: '600',
    margin: '0 0 16px 0',
  },
  emptyText: {
    color: '#aaa',
    fontSize: '14px',
    textAlign: 'center',
    padding: '24px',
    background: '#fff',
    borderRadius: '16px',
    border: '1px dashed #ddd',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  activityCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: '#fff',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #eee',
    animation: 'fadeIn 0.4s ease backwards',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  activityIcon: {
    fontSize: '24px',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  activityDate: {
    display: 'block',
    fontSize: '13px',
    color: '#888',
    marginTop: '2px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: '15px',
    color: '#666',
    cursor: 'pointer',
    padding: '0',
    marginBottom: '20px',
    fontWeight: '500',
  },
  viewTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px',
    fontWeight: '500',
    margin: '0 0 4px 0',
    color: '#1a1a1a',
  },
  viewSubtitle: {
    fontSize: '14px',
    color: '#888',
    margin: '0 0 24px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  input: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    border: '2px solid #eee',
    borderRadius: '12px',
    background: '#fff',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  inputRow: {
    display: 'flex',
    gap: '12px',
  },
  inputSmall: {
    flex: 1,
  },
  select: {
    padding: '16px',
    fontSize: '16px',
    border: '2px solid #eee',
    borderRadius: '12px',
    background: '#fff',
    cursor: 'pointer',
    minWidth: '80px',
  },
  addBtn: {
    background: '#f5f5f5',
    color: '#1a1a1a',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  pendingSection: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '32px',
    border: '2px solid #1a1a1a',
  },
  pendingTitle: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: '#1a1a1a',
    fontWeight: '600',
    margin: '0 0 16px 0',
  },
  exerciseCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  exerciseDetails: {
    display: 'block',
    fontSize: '13px',
    color: '#888',
    marginTop: '2px',
  },
  mealCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  mealMacros: {
    display: 'block',
    fontSize: '12px',
    color: '#888',
    marginTop: '2px',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#ccc',
    cursor: 'pointer',
    padding: '0 8px',
    lineHeight: 1,
  },
  saveBtn: {
    width: '100%',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px',
  },
  historySection: {
    marginTop: '32px',
  },
  historyCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '12px',
    border: '1px solid #eee',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  historyDate: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#1a1a1a',
  },
  deleteBtn: {
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '12px',
    color: '#888',
    cursor: 'pointer',
    transition: 'background 0.2s ease, color 0.2s ease',
  },
  historyExercise: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderTop: '1px solid #f5f5f5',
  },
  historyExName: {
    fontSize: '14px',
    color: '#1a1a1a',
  },
  historyExDetails: {
    fontSize: '13px',
    color: '#888',
  },
  dayTotals: {
    fontSize: '13px',
    color: '#1a1a1a',
    fontWeight: '500',
    marginBottom: '12px',
    padding: '8px 12px',
    background: '#f9f9f9',
    borderRadius: '8px',
  },
  historyMeal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderTop: '1px solid #f5f5f5',
  },
  historyMealName: {
    fontSize: '14px',
    color: '#1a1a1a',
  },
  historyMealCal: {
    fontSize: '13px',
    color: '#888',
  },
  todayMacros: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid #eee',
  },
  macroCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: '#1a1a1a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  macroCircleValue: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '600',
  },
  macroCircleLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  macroDetails: {
    flex: 1,
  },
  macroDetailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  macroDetailLabel: {
    fontSize: '14px',
    color: '#888',
  },
  macroDetailValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid #eee',
    paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
    paddingTop: '8px',
    zIndex: 100,
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '12px',
    color: '#888',
    cursor: 'pointer',
    transition: 'background 0.2s ease, color 0.2s ease',
  },
  navItemActive: {
    color: '#1a1a1a',
  },
  navLabel: {
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
};

const calendarStyles = {
  navigation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  navBtn: {
    background: '#fff',
    border: '2px solid #eee',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
  },
  monthLabel: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    fontWeight: '500',
    color: '#1a1a1a',
  },
  calendar: {
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #eee',
    marginBottom: '24px',
  },
  dayHeaders: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '8px',
  },
  dayHeader: {
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#888',
    padding: '8px 0',
  },
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  emptyDay: {
    aspectRatio: '1',
  },
  day: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    position: 'relative',
    background: '#fafafa',
  },
  today: {
    border: '2px solid #1a1a1a',
    background: '#fff',
  },
  hasWorkout: {
    background: '#1a1a1a',
    color: '#fff',
  },
  dayNumber: {
    fontSize: '14px',
    fontWeight: '500',
  },
  categories: {
    fontSize: '8px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginTop: '2px',
    opacity: 0.8,
  },
  legend: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #eee',
  },
  legendTitle: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: '#888',
    fontWeight: '600',
    margin: '0 0 16px 0',
  },
  legendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendAbbrev: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a1a1a',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: '700',
  },
  legendCat: {
    fontSize: '13px',
    color: '#666',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#fff',
    borderRadius: '20px',
    padding: '24px',
    maxWidth: '400px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    animation: 'fadeIn 0.3s ease',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  modalTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px',
    fontWeight: '500',
    margin: 0,
    color: '#1a1a1a',
  },
  modalClose: {
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
  },
  modalCategories: {
    display: 'inline-block',
    background: '#1a1a1a',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1px',
    marginBottom: '20px',
  },
  modalExercises: {
    borderTop: '1px solid #eee',
    paddingTop: '16px',
  },
  modalExercise: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  modalExName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1a1a1a',
  },
  modalExDetails: {
    fontSize: '14px',
    color: '#888',
  },
};

const settingsStyles = {
  statsCard: {
    background: '#1a1a1a',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
  },
  statsTitle: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    margin: '0 0 16px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: '500',
    color: '#fff',
  },
  statLabel: {
    display: 'block',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.6)',
    marginTop: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  section: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid #eee',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 8px 0',
  },
  sectionDesc: {
    fontSize: '14px',
    color: '#888',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
  },
  exportBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  importBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: '#fff',
    color: '#1a1a1a',
    border: '2px solid #1a1a1a',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnIcon: {
    fontSize: '18px',
    fontWeight: '700',
  },
  dangerSection: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    border: '2px solid #fee2e2',
  },
  dangerTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#dc2626',
    margin: '0 0 8px 0',
  },
  dangerBtn: {
    width: '100%',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  appInfo: {
    textAlign: 'center',
    padding: '24px 0',
  },
  appName: {
    display: 'block',
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: '600',
    letterSpacing: '2px',
    color: '#1a1a1a',
  },
  appVersion: {
    display: 'block',
    fontSize: '12px',
    color: '#888',
    marginTop: '4px',
  },
};
