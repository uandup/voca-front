export { loginWithGoogle, registerProfile } from './api/authApi';
export { requireAuth, requireTeacher, requireStudentArea } from './lib/authGuard';
export type { JwtPayload } from './model/types';
export { decodeToken, getTokenPayload } from './model/jwt';
export { useCurrentStudentId } from './model/useCurrentStudentId';
export { useIsReadOnly } from './model/useIsReadOnly';
export { useActiveChildId } from './model/useActiveChildId';
export {
  getActiveChildId,
  setActiveChildId,
  clearActiveChildId,
  subscribeActiveChildId,
} from './model/activeChild';
export { isAdmin } from './model/isAdmin';
export { useSignOut } from './model/useSignOut';
