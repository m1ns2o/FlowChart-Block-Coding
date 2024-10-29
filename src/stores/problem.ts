import { defineStore } from 'pinia'
import axios from 'axios'

interface Problem {
  id: number
  title: string
}

interface ProblemState {
  problems: Problem[]
  loadedClassNumbers: string[] // 이미 로드된 클래스 번호들을 추적
}

export const useProblemStore = defineStore('problem', {
  state: (): ProblemState => ({
    problems: [],
    loadedClassNumbers: []
  }),
  
  actions: {
    async fetchProblems(classnum: string) {
      // 이미 해당 클래스의 문제들이 로드되어 있는지 확인
      if (this.loadedClassNumbers.includes(classnum)) {
        console.log('캐시된 데이터 사용')
        return
      }

      try {
        const response = await axios.get(`classes/number/${classnum}`)
        console.log('API 응답:', response.data)
        
        this.problems = response.data.Problems.map((problem: { ID: number; Title: string; }) => ({
          id: problem.ID,
          title: problem.Title
        }))
        
        // 로드된 클래스 번호 추가
        this.loadedClassNumbers.push(classnum)
      } catch (error) {
        console.error('문제 목록 가져오기 실패:', error)
        throw error
      }
    },

    // 선택적: store 데이터 초기화 메소드
    clearStore() {
      this.problems = []
      this.loadedClassNumbers = []
    }
  },

  getters: {
    getProblemList: (state) => state.problems,
    isDataLoaded: (state) => (classnum: string) => state.loadedClassNumbers.includes(classnum)
  }
})