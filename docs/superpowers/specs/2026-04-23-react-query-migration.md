# Wave C — Complete Domain Hook Migration to React Query

## Context

Wave 4 introduced `react-query` and migrated `usePatient` and `useProvider` to query-backed facades. Those hooks now get caching, deduplication, and background refetching for free. However, the majority of domain hooks still use internal `useState` and manually trigger API calls.

This wave completes the migration so **all server-state in the app is managed through `react-query`**, while local UI state (modals, forms, selected tabs) stays in `useState` where it belongs.

## Goals

1. Migrate every domain hook that fetches or mutates server data to use `react-query`.
2. Preserve the existing public API of each hook so views don't need to change.
3. Add query key coverage for all domain entities.
4. Keep the test suite green.

## Scope

### In Scope

- **Hooks to migrate:**
  - `useAdmin` — admin profile, permissions, stats, user/clinic/content management
  - `useAppointment` — patient and provider appointment fetching, creation, cancellation
  - `useConsultation` — active consultations, request/cancel/complete/rate
  - `useConsultationMessages` — message fetching, sending, clearing
  - `useConsultationNotes` — notes fetch/create/update/finalise
  - `useStaff` — staff list, invite, update, deactivate
  - `useSymptomChecker` — symptom data, checks, history

- **Platform updates:**
  - Expand `src/platform/query/queryKeys.js` with keys for all domains

### Out of Scope

- Replacing `useState` for purely local UI state (modal open/close, form inputs, selected tabs)
- Changing any view components — hooks must remain API-compatible
- Adding new features or changing endpoint contracts

## Architecture

### Pattern

Each migrated hook follows this structure:

```js
export const useX = () => {
  const client = useQueryClient();

  // Queries
  const listQuery = useQuery({
    queryKey: queryKeys.x.list,
    queryFn: xService.getAll,
    enabled: false,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: xService.create,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.x.list });
    },
  });

  return {
    // Expose the same API as before
    fetchX: () => listQuery.refetch(),
    createX: createMutation.mutateAsync,
    x: listQuery.data ?? null,
    loading: listQuery.isFetching || createMutation.isPending,
    error: listQuery.error?.message || createMutation.error?.message || null,
  };
};
```

### Query Keys

```
admin: {
  profile: ["admin", "profile"],
  permissions: ["admin", "permissions"],
  stats: ["admin", "stats"],
  users: ["admin", "users"],
  clinics: ["admin", "clinics"],
  content: ["admin", "content"],
}
appointment: {
  list: ["appointments", "list"],
  detail: (id) => ["appointments", "detail", id],
}
consultation: {
  active: ["consultations", "active"],
  messages: (id) => ["consultations", id, "messages"],
  notes: (id) => ["consultations", id, "notes"],
}
staff: {
  list: ["staff", "list"],
}
symptom: {
  data: ["symptoms", "data"],
  history: ["symptoms", "history"],
}
```

## Testing Strategy

- Update existing unit tests for migrated hooks to use `QueryClientProvider`
- Add MSW handlers for any new endpoints tests hit
- Run the full suite to catch API-breaking changes

## Definition of Done

- [ ] All 7 hooks listed above use `react-query` for server state.
- [ ] `queryKeys.js` covers all domains.
- [ ] No hook uses `useState` for data that comes from the server.
- [ ] `npm test -- --watchAll=false` passes.
- [ ] `npm run build` passes.
