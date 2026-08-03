import { test, expect } from '@playwright/test';
import { uniqueName } from './testUtils';

test.describe('설정', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('카테고리 추가 → 수정 → 삭제', async ({ page }) => {
    const categoryName = uniqueName('E2E카테고리');
    const categoryRenamed = uniqueName('E2E카테고리수정');

    await page.getByRole('button', { name: '카테고리 관리' }).click();
    const modal = page.getByRole('dialog', { name: '카테고리 관리' });
    await expect(modal).toBeVisible();

    // 추가
    await modal.getByRole('button', { name: '카테고리 추가' }).click();
    const addModal = page.getByRole('dialog', { name: '카테고리 추가' });
    await addModal.getByPlaceholder('카테고리 이름').fill(categoryName);
    await addModal.getByRole('button', { name: '저장' }).click();
    await expect(modal.getByText(categoryName)).toBeVisible();

    // 수정
    await modal.getByRole('button', { name: `${categoryName} 편집` }).click();
    const editModal = page.getByRole('dialog', { name: '카테고리 편집' });
    await editModal.getByPlaceholder('카테고리 이름').fill(categoryRenamed);
    await editModal.getByRole('button', { name: '저장' }).click();
    await expect(modal.getByText(categoryRenamed)).toBeVisible();

    // 삭제
    await modal.getByRole('button', { name: `${categoryRenamed} 삭제` }).click();
    const confirm = page.getByRole('alertdialog');
    await expect(confirm).toBeVisible();
    await confirm.getByRole('button', { name: '삭제' }).click();
    await expect(modal.getByText(categoryRenamed)).not.toBeVisible();
  });

  test('동기부여 메시지 추가 → 수정 → 삭제', async ({ page }) => {
    const messageText = uniqueName('E2E 동기부여 메시지');
    const messageRenamed = uniqueName('E2E 동기부여 메시지 수정');

    await page.getByRole('button', { name: '동기부여 메시지' }).click();
    const modal = page.getByRole('dialog', { name: '동기부여 메시지' });
    await expect(modal).toBeVisible();

    // 추가 — 새 메시지는 목록 맨 끝에 추가됨
    await modal.getByPlaceholder('새 동기부여 메시지 입력').fill(messageText);
    await modal.getByRole('button', { name: '추가' }).click();
    await expect(modal.getByText(messageText)).toBeVisible();

    // 수정 — 편집 모드로 들어간 행의 입력란은 별도 라벨이 없어 '메시지 저장' 버튼과
    // 같은 행(ancestor div) 안에서 찾는다
    await modal
      .getByText(messageText)
      .locator('xpath=ancestor::div[1]')
      .getByRole('button', { name: '메시지 편집' })
      .click();
    const saveBtn = modal.getByRole('button', { name: '메시지 저장' });
    await saveBtn.locator('xpath=ancestor::div[1]').getByRole('textbox').fill(messageRenamed);
    await saveBtn.click();
    await expect(modal.getByText(messageRenamed)).toBeVisible();

    // 삭제 — 같은 방식으로 해당 메시지가 속한 행을 찾아 삭제 버튼 클릭
    await modal
      .getByText(messageRenamed)
      .locator('xpath=ancestor::div[1]')
      .getByRole('button', { name: '메시지 삭제' })
      .click();
    await expect(modal.getByText(messageRenamed)).not.toBeVisible();
  });
});
