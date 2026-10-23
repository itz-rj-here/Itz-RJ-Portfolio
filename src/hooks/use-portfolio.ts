import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { defaultPortfolioData, PortfolioData } from "@/data/portfolio";
import {
  fetchPortfolioData,
  updateProjectsApi,
  updateCertificatesApi,
  updateSkillsApi,
  updateAboutApi,
  updateSocialsApi,
  resetPortfolioApi,
  saveFullPortfolioData,
} from "@/lib/supabase";

export const PORTFOLIO_QUERY_KEY = ["portfolio-data"] as const;

export function usePortfolioData() {
  return useQuery<PortfolioData>({
    queryKey: PORTFOLIO_QUERY_KEY,
    queryFn: fetchPortfolioData,
    placeholderData: defaultPortfolioData,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export function usePortfolioMutations() {
  const queryClient = useQueryClient();

  const applySavedData = (saved: PortfolioData) => {
    queryClient.setQueryData(PORTFOLIO_QUERY_KEY, saved);
    queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
  };

  const updateProjects = useMutation({
    mutationFn: updateProjectsApi,
    onSuccess: applySavedData,
  });

  const updateCertificates = useMutation({
    mutationFn: updateCertificatesApi,
    onSuccess: applySavedData,
  });

  const updateSkills = useMutation({
    mutationFn: updateSkillsApi,
    onSuccess: applySavedData,
  });

  const updateAbout = useMutation({
    mutationFn: updateAboutApi,
    onSuccess: applySavedData,
  });

  const updateSocials = useMutation({
    mutationFn: ({
      socialLinks,
      location,
    }: {
      socialLinks: PortfolioData["socialLinks"];
      location?: string;
    }) => updateSocialsApi(socialLinks, location),
    onSuccess: applySavedData,
  });

  const resetPortfolio = useMutation({
    mutationFn: resetPortfolioApi,
    onSuccess: applySavedData,
  });

  const syncToSupabase = useMutation({
    mutationFn: (currentData: PortfolioData) => saveFullPortfolioData(currentData),
    onSuccess: applySavedData,
  });

  return {
    updateProjects,
    updateCertificates,
    updateSkills,
    updateAbout,
    updateSocials,
    resetPortfolio,
    syncToSupabase,
  };
}
