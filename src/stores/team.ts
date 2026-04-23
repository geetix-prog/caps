import { ref } from 'vue'
import { defineStore } from 'pinia'
import { pb } from '@/plugins/pocketbase'

export interface Team {
  id: string
  name: string
  description: string
  logo: string
  creator: string
  invite_code: string
  created: string
  updated: string
  memberCount?: number
  expand?: {
    creator?: { id: string; name: string; username: string; avatar: string }
  }
}

export interface TeamMembership {
  id: string
  team: string
  user: string
  created: string
  expand?: {
    user?: { id: string; name: string; username: string; avatar: string }
    team?: Team
  }
}

export const useTeamStore = defineStore('team', () => {
  const teams = ref<Team[]>([])
  const currentTeam = ref<Team | null>(null)
  const memberships = ref<TeamMembership[]>([])
  const myTeam = ref<Team | null>(null)
  const isLoading = ref(false)
  const error = ref('')

  function clearError() {
    error.value = ''
  }

  function getLogoUrl(team: Team): string {
    if (!team.logo) return ''
    return pb.files.getURL(team as any, team.logo)
  }

  function getMemberAvatarUrl(member: { id: string; name: string; username: string; avatar: string }): string {
    if (!member.avatar) return ''
    return pb.files.getURL(member as any, member.avatar)
  }

  async function fetchMyTeam(): Promise<void> {
    const userId = pb.authStore.record?.id
    if (!userId) { myTeam.value = null; return }
    try {
      const result = await pb.collection('team_memberships').getList(1, 1, {
        filter: `user = "${userId}"`,
        expand: 'team',
      })
      myTeam.value = result.items.length > 0
        ? (result.items[0] as any).expand?.team ?? null
        : null
    } catch {
      myTeam.value = null
    }
  }

  async function fetchTeams() {
    isLoading.value = true
    error.value = ''
    try {
      const records = await pb.collection('teams').getFullList({
        sort: '-created',
        expand: 'creator',
      })

      let memberCounts: Record<string, number> = {}
      try {
        const allMemberships = await pb.collection('team_memberships').getFullList({
          fields: 'id,team',
        })
        for (const m of allMemberships) {
          memberCounts[m.team] = (memberCounts[m.team] || 0) + 1
        }
      } catch {
        // si la requête memberships échoue on affiche quand même les équipes
      }

      teams.value = (records as unknown as Team[]).map((t) => ({
        ...t,
        memberCount: memberCounts[t.id] || 0,
      }))
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des équipes'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTeam(id: string) {
    isLoading.value = true
    error.value = ''
    try {
      const record = await pb.collection('teams').getOne(id, {
        expand: 'creator',
      })
      currentTeam.value = record as unknown as Team

      const memberRecords = await pb.collection('team_memberships').getFullList({
        filter: `team = "${id}"`,
        expand: 'user',
        sort: 'created',
      })
      memberships.value = memberRecords as unknown as TeamMembership[]
    } catch (err: any) {
      error.value = err.message || 'Équipe introuvable'
      currentTeam.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function createTeam(data: {
    name: string
    description: string
    logo?: File | null
  }): Promise<Team | null> {
    isLoading.value = true
    error.value = ''
    try {
      const userId = pb.authStore.record?.id
      if (!userId) throw new Error('Non connecté')

      if (myTeam.value) {
        error.value = 'Vous êtes déjà dans une équipe'
        return null
      }

      const formData = new FormData()
      formData.append('name', data.name.trim())
      formData.append('description', data.description.trim())
      formData.append('creator', userId)
      formData.append('is_public', 'true')
      if (data.logo) formData.append('logo', data.logo)

      const team = await pb.collection('teams').create(formData)

      await pb.collection('team_memberships').create({
        team: team.id,
        user: userId,
      })

      myTeam.value = team as unknown as Team
      return team as unknown as Team
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function joinByInviteCode(code: string): Promise<Team | null> {
    isLoading.value = true
    error.value = ''
    try {
      const userId = pb.authStore.record?.id
      if (!userId) throw new Error('Non connecté')

      if (myTeam.value) {
        error.value = 'Vous êtes déjà dans une équipe'
        return null
      }

      const results = await pb.collection('teams').getList(1, 1, {
        filter: `id = "${code.trim()}"`,
      })

      if (results.items.length === 0) {
        error.value = "Code d'invitation invalide"
        return null
      }

      const team = results.items[0] as unknown as Team

      await pb.collection('team_memberships').create({
        team: team.id,
        user: userId,
      })

      myTeam.value = team
      return team
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la tentative de rejoindre'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function joinTeam(teamId: string): Promise<boolean> {
    isLoading.value = true
    error.value = ''
    try {
      const userId = pb.authStore.record?.id
      if (!userId) throw new Error('Non connecté')

      if (myTeam.value) {
        error.value = 'Vous êtes déjà dans une équipe'
        return false
      }

      await pb.collection('team_memberships').create({
        team: teamId,
        user: userId,
      })

      await fetchMyTeam()
      return true
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la tentative de rejoindre'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function leaveTeam(teamId: string): Promise<boolean> {
    isLoading.value = true
    error.value = ''
    try {
      const userId = pb.authStore.record?.id
      if (!userId) throw new Error('Non connecté')

      const existing = await pb.collection('team_memberships').getList(1, 1, {
        filter: `team = "${teamId}" && user = "${userId}"`,
      })

      if (existing.items.length === 0) return false

      await pb.collection('team_memberships').delete(existing.items[0]!.id)
      myTeam.value = null
      return true
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la tentative de quitter'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function checkMembership(teamId: string): Promise<boolean> {
    const userId = pb.authStore.record?.id
    if (!userId) return false
    try {
      const result = await pb.collection('team_memberships').getList(1, 1, {
        filter: `team = "${teamId}" && user = "${userId}"`,
      })
      return result.items.length > 0
    } catch {
      return false
    }
  }

  async function updateTeam(
    teamId: string,
    data: { name: string; description: string; logo?: File | null; removeLogo?: boolean },
  ): Promise<boolean> {
    isLoading.value = true
    error.value = ''
    try {
      const formData = new FormData()
      formData.append('name', data.name.trim())
      formData.append('description', data.description.trim())
      if (data.logo) {
        formData.append('logo', data.logo)
      } else if (data.removeLogo) {
        formData.append('logo', '')
      }

      const updated = await pb.collection('teams').update(teamId, formData)
      currentTeam.value = updated as unknown as Team
      if (myTeam.value?.id === teamId) {
        myTeam.value = updated as unknown as Team
      }
      return true
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la modification'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTeam(teamId: string): Promise<boolean> {
    isLoading.value = true
    error.value = ''
    try {
      await pb.collection('teams').delete(teamId)
      myTeam.value = null
      return true
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    teams,
    currentTeam,
    memberships,
    myTeam,
    isLoading,
    error,
    clearError,
    getLogoUrl,
    getMemberAvatarUrl,
    fetchMyTeam,
    fetchTeams,
    fetchTeam,
    createTeam,
    joinByInviteCode,
    joinTeam,
    leaveTeam,
    checkMembership,
    updateTeam,
    deleteTeam,
  }
})
