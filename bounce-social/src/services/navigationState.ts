// Shared navigation state for coordinating between tabs

interface NavigationState {
  groupId: string | null;
  activityId: string | null;
}

let navigationState: NavigationState = {
  groupId: null,
  activityId: null,
};

const listeners: Set<() => void> = new Set();

export const setNavigationTarget = (groupId: string, activityId: string) => {
  navigationState = { groupId, activityId };
  listeners.forEach(listener => listener());
};

export const getNavigationTarget = (): NavigationState => {
  return navigationState;
};

export const clearNavigationTarget = () => {
  navigationState = { groupId: null, activityId: null };
};

export const subscribeToNavigation = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
